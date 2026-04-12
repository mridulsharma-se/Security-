import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';
import { scanAndHeal } from '@/agents/orchestrator';
import { supabaseAdmin } from '@/lib/supabase/admin';

const SCANNABLE = /^(app\/api\/.*\.ts|supabase\/migrations\/.*\.sql)$/;

function classify(path: string): 'route' | 'sql_schema' | null {
  if (path.endsWith('.sql')) return 'sql_schema';
  if (path.startsWith('app/api/') && path.endsWith('.ts')) return 'route';
  return null;
}

function verifySignature(body: string, signature: string | null): boolean {
  if (!signature) return false;
  const secret = process.env.GITHUB_WEBHOOK_SECRET!;
  const hmac = crypto.createHmac('sha256', secret).update(body).digest('hex');
  const expected = `sha256=${hmac}`;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export async function POST(req: Request) {
  const raw = await req.text();
  const sig = req.headers.get('x-hub-signature-256');
  if (!verifySignature(raw, sig)) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 });
  }

  const event = req.headers.get('x-github-event');
  if (event !== 'push') return NextResponse.json({ ok: true, skipped: event });

  const payload = JSON.parse(raw) as {
    after: string;
    ref: string;
    repository: { id: number; full_name: string; default_branch: string };
    installation?: { id: number };
    commits: Array<{ added: string[]; modified: string[] }>;
  };

  const installationId = payload.installation?.id;
  if (!installationId) return NextResponse.json({ error: 'no installation' }, { status: 400 });

  const { data: repo } = await supabaseAdmin
    .from('repositories')
    .select('*')
    .eq('github_repo_id', payload.repository.id)
    .maybeSingle();
  if (!repo || !repo.scan_enabled) return NextResponse.json({ ok: true, skipped: 'not enrolled' });

  const changedPaths = Array.from(
    new Set(payload.commits.flatMap((c) => [...c.added, ...c.modified])),
  ).filter((p) => SCANNABLE.test(p));

  if (!changedPaths.length) return NextResponse.json({ ok: true, scanned: 0 });

  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: process.env.GITHUB_APP_ID!,
      privateKey: process.env.GITHUB_APP_PRIVATE_KEY!,
      installationId,
    },
  });

  const [owner, name] = payload.repository.full_name.split('/');
  const results: Array<{ path: string; healed: number; prUrl?: string }> = [];

  for (const path of changedPaths) {
    const kind = classify(path);
    if (!kind) continue;

    const { data: file } = await octokit.repos.getContent({
      owner,
      repo: name,
      path,
      ref: payload.after,
    });
    if (Array.isArray(file) || file.type !== 'file') continue;
    const source = Buffer.from(file.content, 'base64').toString('utf8');

    const result = await scanAndHeal({
      repositoryId: repo.id,
      installationId,
      owner,
      repo: name,
      baseBranch: payload.repository.default_branch,
      headSha: payload.after,
      filePath: path,
      source,
      artifactKind: kind,
    });
    results.push({ path, ...result });
  }

  await supabaseAdmin
    .from('repositories')
    .update({ last_scanned_sha: payload.after })
    .eq('id', repo.id);

  return NextResponse.json({ ok: true, results });
}
