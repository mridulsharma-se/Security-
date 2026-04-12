import { runAttackerAgent } from './attacker';
import { runFixerAgent } from './fixer';
import { openFixPullRequest } from '@/github/pr-engine';
import { supabaseAdmin } from '@/lib/supabase/admin';

export interface ScanAndHealInput {
  repositoryId: string;
  installationId: number;
  owner: string;
  repo: string;
  baseBranch: string;
  headSha: string;
  filePath: string;
  source: string;
  artifactKind: 'route' | 'server_action' | 'sql_schema';
}

export async function scanAndHeal(args: ScanAndHealInput) {
  const report = await runAttackerAgent({
    repositoryId: args.repositoryId,
    commitSha: args.headSha,
    filePath: args.filePath,
    source: args.source,
    artifactKind: args.artifactKind,
  });

  if (!report.findings.length) return { healed: 0 as const };

  const fix = await runFixerAgent({
    filePath: args.filePath,
    originalSource: args.source,
    report,
  });

  const { data: vuln, error } = await supabaseAdmin
    .from('vulnerabilities')
    .select('id')
    .eq('repository_id', args.repositoryId)
    .eq('commit_sha', args.headSha)
    .eq('file_path', args.filePath)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !vuln) throw new Error('vulnerability row not found after persist');

  const pr = await openFixPullRequest({
    installationId: args.installationId,
    owner: args.owner,
    repo: args.repo,
    baseBranch: args.baseBranch,
    headSha: args.headSha,
    filePath: args.filePath,
    vulnerabilityId: vuln.id,
    report,
    fix,
  });

  return { healed: report.findings.length, prUrl: pr.html_url };
}
