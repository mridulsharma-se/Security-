import { NextResponse } from 'next/server';
import { runAttackerAgent } from '@/agents/attacker';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { source, filePath, artifactKind } = body;

    if (!source || !filePath || !artifactKind) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const report = await runAttackerAgent({
      repositoryId: 'local',
      commitSha: 'local',
      filePath,
      source,
      artifactKind,
      skipPersist: true,
    });

    return NextResponse.json({ ok: true, findings: report.findings });
  } catch (error) {
    console.error('[Live Scan] Error:', error);
    return NextResponse.json({ error: 'Live scan failed' }, { status: 500 });
  }
}
