import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import OnDemandScanner from './components/OnDemandScanner';

export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: vulnerabilities, error } = await supabase
    .from('vulnerabilities')
    .select('*, repositories(full_name)')
    .order('created_at', { ascending: false })
    .limit(50);

  const stats = {
    critical: vulnerabilities?.filter(v => v.severity === 'critical').length || 0,
    high: vulnerabilities?.filter(v => v.severity === 'high').length || 0,
    healed: vulnerabilities?.filter(v => v.status === 'pr_open' || v.status === 'merged').length || 0,
  };

  return (
    <div className="dashboard-container">
      <header className="page-header">
        <h1>Projects & Analysis</h1>
        <p>Real-time autonomous vulnerability detection and healing.</p>
      </header>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-title">Critical Threats</div>
          <div className="stat-value" style={{ color: 'var(--critical-color)' }}>{stats.critical}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">High Severity</div>
          <div className="stat-value" style={{ color: 'var(--high-color)' }}>{stats.high}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">AI Auto-Patched</div>
          <div className="stat-value" style={{ color: 'var(--text-main)' }}>{stats.healed}</div>
        </div>
      </div>

      <section className="surface-panel" style={{ marginBottom: '2.5rem', padding: '2rem' }}>
        <h2 className="section-title">
          Vulnerability Feed
        </h2>

        {!vulnerabilities || vulnerabilities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No vulnerabilities detected. Good job!
          </div>
        ) : (
          <div className="vuln-list">
            {vulnerabilities.map((vuln) => (
              <div key={vuln.id} className="vuln-item">
                <div className="vuln-info">
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="16" height="16" fill="var(--text-muted)" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"></path><path d="M14 3v5h5M16 13H8M16 17H8M10 9H8"></path></svg>
                    {vuln.title}
                  </h4>
                  <div className="vuln-meta" style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <span style={{ color: 'var(--accent-primary)', fontWeight: '500' }}>{vuln.repositories?.full_name}</span>
                    <span>•</span>
                    <span>{vuln.file_path}:{vuln.line_start}</span>
                    <span>•</span>
                    <span suppressHydrationWarning>{new Date(vuln.created_at).toLocaleString()}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {vuln.status === 'pr_open' && (
                    <span className="badge" style={{ background: 'var(--accent-dim)', color: 'var(--accent-primary)', border: '1px solid var(--accent-primary)' }}>
                      Patch PR Open
                    </span>
                  )}
                  <span className={`badge ${vuln.severity}`}>
                    {vuln.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <OnDemandScanner />
    </div>
  );
}
