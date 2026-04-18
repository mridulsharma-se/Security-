import { NextResponse } from 'next/server';
import { scanAndHeal } from '@/agents/orchestrator';

export const maxDuration = 300; // allow Vercel to run this worker for 5 minutes

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate custom internal secret to ensure only our webhook can trigger this
    const authHeader = req.headers.get('Authorization');
    if (authHeader !== `Bearer ${process.env.INTERNAL_WORKER_SECRET || 'dev_secret'}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { repo, installationId, owner, name, baseBranch, headSha, results } = body;
    
    console.log(`[Worker] Beginning async scan for ${results.length} files...`);

    // We process each file sequentially or in parallel.
    // For large PRs, sequential is safer to avoid overwhelming the concurrent LLM rate limits.
    for (const item of results) {
       console.log(`[Worker] Scanning ${item.path}...`);
       await scanAndHeal({
         repositoryId: repo.id,
         installationId,
         owner,
         repo: name,
         baseBranch,
         headSha,
         filePath: item.path,
         source: item.source,
         artifactKind: item.kind,
       });
    }
    
    console.log(`[Worker] Successfully completed async scan.`);
    return NextResponse.json({ ok: true, scanned: results.length });
  } catch (error) {
    console.error('[Worker] Fatal error executing background job', error);
    return NextResponse.json({ error: 'Internal worker failure' }, { status: 500 });
  }
}
