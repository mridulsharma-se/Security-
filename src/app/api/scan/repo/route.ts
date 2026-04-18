import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import { runAttackerAgent } from '@/agents/attacker';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const maxDuration = 60; // Max allowed for hobby/pro vercel

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const body = await req.json();
    let { owner, repo, branch } = body;

    // Handle full URLs like https://github.com/owner/repo
    if (owner && owner.includes('github.com')) {
       try {
         const url = new URL(owner);
         const parts = url.pathname.split('/').filter(Boolean);
         if (parts.length >= 2) {
            owner = parts[0];
            repo = parts[1];
         }
       } catch (e) {}
    }

    if (!owner || !repo) {
      return NextResponse.json({ error: 'Missing owner or repo' }, { status: 400 });
    }
    
    if (!branch) branch = 'main';

    const octokit = new Octokit();

    // 1. Get Repo ID to setup database relation
    let githubRepoId = 0;
    try {
      const { data: repoData } = await octokit.repos.get({ owner, repo });
      githubRepoId = repoData.id;
    } catch(e) {}

    let dbRepoId = null;
    if (user) {
      const { data: repoRow, error } = await supabaseAdmin
        .from('repositories')
        .upsert({
           owner_id: user.id,
           github_repo_id: githubRepoId || Math.floor(Math.random() * 1000000), // fallback
           full_name: `${owner}/${repo}`,
           default_branch: branch,
           installation_id: 0,
           scan_enabled: true
        }, { onConflict: 'github_repo_id' })
        .select('id')
        .single();
      
      if (repoRow) dbRepoId = repoRow.id;
    }

    // 2. Get the latest commit SHA for the branch so we can get its tree
    const { data: refData } = await octokit.repos.getCommit({
      owner,
      repo,
      ref: branch,
    });
    
    // 3. Get the tree recursively
    const { data: treeData } = await octokit.git.getTree({
      owner,
      repo,
      tree_sha: refData.sha,
      recursive: "true",
    });

    // 4. Filter for interesting files (e.g., .ts, .js, .sql)
    const interestingFiles = treeData.tree.filter((t) => 
      t.type === 'blob' && 
      t.path && 
      (t.path.endsWith('.ts') || t.path.endsWith('.js') || t.path.endsWith('.sql')) &&
      !t.path.includes('node_modules') &&
      !t.path.includes('.next') &&
      !t.path.includes('.min.js')
    );

    // Take top 3 for speed on serverless architecture to avoid timeout
    const toScan = interestingFiles.slice(0, 3);
    let allFindings = [];

    for (const file of toScan) {
      if (!file.path) continue;
      // Get file content
      const { data: fileContent } = await octokit.repos.getContent({
        owner,
        repo,
        path: file.path,
        ref: refData.sha,
      });

      if (!Array.isArray(fileContent) && fileContent.type === 'file' && fileContent.content) {
        const source = Buffer.from(fileContent.content, 'base64').toString('utf8');
        
        let artifactKind = 'route';
        if (file.path.endsWith('.sql')) artifactKind = 'sql_schema';
        
        const report = await runAttackerAgent({
          repositoryId: dbRepoId || `${owner}/${repo}`,
          commitSha: refData.sha,
          filePath: file.path,
          source,
          artifactKind: artifactKind as any,
          skipPersist: !dbRepoId, // Save to DB if we logged them in
        });

        if (report.findings.length > 0) {
           const enhancedFindings = report.findings.map((f: any) => ({ ...f, file_path: file.path }));
           allFindings.push(...enhancedFindings);
        }
      }
    }

    return NextResponse.json({ 
      ok: true, 
      scannedCount: toScan.length, 
      totalFiles: interestingFiles.length,
      findings: allFindings 
    });
  } catch (error: any) {
    console.error('[Repo Scan] Error:', error);
    return NextResponse.json({ error: error.message || 'Repo scan failed' }, { status: 500 });
  }
}
