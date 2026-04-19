import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const revalidate = 0;

export default async function IssuesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch all vulnerabilities for the dense table view
  const { data: vulnerabilities } = await supabase
    .from('vulnerabilities')
    .select('base_commit, branch, created_at, exploit_narrative, file_path, id, line_start, proof_of_concept, prompt_tokens, pr_url, repository_id, severity, status, title, repositories(full_name)')
    .order('created_at', { ascending: false })
    .limit(200);

  return (
    <div className="dashboard-container">
      <header className="page-header">
        <h1>Vulnerability Ledger</h1>
        <p>A comprehensive tracking system for all detected repository issues.</p>
      </header>

      <section className="surface-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className="section-title" style={{ margin: 0, border: 'none' }}>All Tracked Issues</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
             <button className="tab-btn active">Open</button>
             <button className="tab-btn">Auto-Patched</button>
             <button className="tab-btn">Ignored</button>
          </div>
        </div>

        {!vulnerabilities || vulnerabilities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24" style={{ margin: '0 auto 1rem auto', opacity: 0.5 }}>
               <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>Your ledger is perfectly clean. No historical vulnerabilities detected.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Severity</th>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Vulnerability Title</th>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Target Repository</th>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Detected On</th>
                </tr>
              </thead>
              <tbody>
                {vulnerabilities.map((vuln) => (
                  <tr key={vuln.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.2s' }} className="table-row-hover">
                    <td style={{ padding: '1rem' }}>
                      <span className={`badge ${vuln.severity}`}>{vuln.severity}</span>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 500 }}>
                      <div style={{ color: 'var(--text-main)' }}>{vuln.title}</div>
                      {vuln.file_path && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'Roboto Mono, monospace', marginTop: '0.25rem' }}>{vuln.file_path}:{vuln.line_start}</div>}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--accent-primary)', fontWeight: 500 }}>
                      {(Array.isArray(vuln.repositories) ? vuln.repositories[0]?.full_name : (vuln.repositories as any)?.full_name) || 'Manual Audit'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {vuln.status === 'pr_open' ? (
                        <a href={vuln.pr_url || '#'} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                          <span className="badge" style={{ background: 'var(--accent-dim)', color: 'var(--accent-primary)', border: '1px solid var(--accent-primary)' }}>
                            PR Active →
                          </span>
                        </a>
                      ) : vuln.status === 'merged' ? (
                         <span className="badge" style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}>Fixed</span>
                      ) : (
                         <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Pending</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }} suppressHydrationWarning>
                      {new Date(vuln.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        .table-row-hover:hover { background: rgba(0,0,0,0.15); cursor: pointer; }
      `}} />
    </div>
  );
}
