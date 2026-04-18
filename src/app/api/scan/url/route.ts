import { NextResponse } from 'next/server';
import { runDastAgent } from '@/agents/dast';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const maxDuration = 60; // Max allowed for Vercel

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const body = await req.json();
    let { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'Missing url' }, { status: 400 });
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    // Attempt to fetch the live URL
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      // Increase timeout to 30s to handle slow servers and mitigate silent WAF drops
      signal: AbortSignal.timeout(30000) 
    });

    const html = await response.text();
    
    // Extract headers into a readable string
    const headersArray: string[] = [];
    response.headers.forEach((value, key) => {
      headersArray.push(`${key}: ${value}`);
    });
    const headersString = headersArray.join('\n');

    let dbRepoId = null;

    if (user) {
      // Masquerade the DAST scan as a repository entry so it shows on the dashboard
      const { data: repoRow, error } = await supabaseAdmin
        .from('repositories')
        .upsert({
           owner_id: user.id,
           github_repo_id: Math.floor(Math.random() * 100000000) + 10000000, 
           full_name: `[DAST] ${new URL(url).hostname}`,
           default_branch: 'live',
           installation_id: 0,
           scan_enabled: true
        }, { onConflict: 'github_repo_id' })
        .select('id')
        .single();
      
      if (repoRow) dbRepoId = repoRow.id;
    }

    const report = await runDastAgent({
      repositoryId: dbRepoId || undefined,
      url,
      html,
      headers: headersString,
      skipPersist: !dbRepoId, 
    });

    return NextResponse.json({ 
      ok: true, 
      findings: report.findings,
      status: response.status
    });
  } catch (error: any) {
    console.error('[DAST Scan] Error:', error);
    return NextResponse.json({ error: error.message || 'Website scan failed' }, { status: 500 });
  }
}
