import { supabaseAdmin } from '@/lib/supabase/admin';
import LiveScanner from './components/LiveScanner';

export const revalidate = 0;

export default async function DashboardPage() {
  const { data: vulnerabilities, error } = await supabaseAdmin
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
    <main className="dashboard-container">
      <header className="page-header">
        <h1>Security Operations Center</h1>
        <p>Real-time autonomous vulnerability detection and healing.</p>
      </header>

      <div className="stats-grid">
        <div className="glass-panel">
          <div className="stat-title">Critical Threats</div>
          <div className="stat-value" style={{ color: 'var(--critical-color)' }}>{stats.critical}</div>
        </div>
        <div className="glass-panel">
          <div className="stat-title">High Severity</div>
          <div className="stat-value" style={{ color: 'var(--high-color)' }}>{stats.high}</div>
        </div>
        <div className="glass-panel">
          <div className="stat-title">Patched via AI</div>
          <div className="stat-value" style={{ color: 'var(--success-color)' }}>{stats.healed}</div>
        </div>
      </div>

      <section className="glass-panel" style={{ padding: '2rem' }}>
        <h2 className="section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          Recent Detections
        </h2>

        {!vulnerabilities || vulnerabilities.length === 0 ? (
          <div className="empty-state">
            <p>No vulnerabilities detected. All systems secure.</p>
          </div>
        ) : (
          <div className="vuln-list">
            {vulnerabilities.map((vuln) => (
              <div key={vuln.id} className="vuln-item">
                <div className="vuln-info">
                  <h4>{vuln.title}</h4>
                  <div className="vuln-meta">
                    {/* @ts-ignore - TS doesn't know about join payload typing easily here */}
                    {vuln.repositories?.full_name} • {vuln.file_path}:{vuln.line_start} • {new Date(vuln.created_at).toLocaleString()}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {vuln.status === 'pr_open' && (
                    <span className="badge" style={{ background: 'rgba(82, 196, 26, 0.15)', color: '#52c41a', border: '1px solid rgba(82, 196, 26, 0.3)' }}>
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

      <LiveScanner />
    </main>
  );
}
