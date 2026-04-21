import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import OnDemandScanner from '../components/OnDemandScanner';

export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: vulnerabilities } = await supabase
    .from('vulnerabilities')
    .select('*, repositories(full_name)')
    .order('created_at', { ascending: false })
    .limit(50);

  const stats = {
    critical: vulnerabilities?.filter(v => v.severity === 'critical').length || 0,
    high: vulnerabilities?.filter(v => v.severity === 'high').length || 0,
    medium: vulnerabilities?.filter(v => v.severity === 'medium').length || 0,
    fixed: vulnerabilities?.filter(v => v.status === 'merged').length || 0,
    total: vulnerabilities?.length || 0,
  };

  const criticalTrend = stats.critical > 0 ? '+5' : '0';
  const securityScore = Math.max(0, 100 - (stats.critical * 20 + stats.high * 10 + stats.medium * 5));

  return (
    <div className="dashboard-container">
      <header className="page-header">
        <h1>Security Dashboard</h1>
        <p>Real-time autonomous vulnerability detection and AI-powered remediation.</p>
      </header>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Critical Issues</div>
            <div className="stat-icon">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
              </svg>
            </div>
          </div>
          <div className="stat-value" style={{ color: 'var(--critical-color)' }}>{stats.critical}</div>
          <div className="stat-meta negative">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M7 14l5-5 5 5z"/></svg>
            {criticalTrend} since last week
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">High Severity</div>
            <div className="stat-icon">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
              </svg>
            </div>
          </div>
          <div className="stat-value" style={{ color: 'var(--high-color)' }}>{stats.high}</div>
          <div className="stat-meta">
            <span>{stats.medium} medium issues</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Fixed</div>
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success-color)' }}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>
          </div>
          <div className="stat-value" style={{ color: 'var(--success-color)' }}>{stats.fixed}</div>
          <div className="stat-meta positive">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
            {stats.fixed > 0 ? `${Math.round((stats.fixed / stats.total) * 100)}%` : '0%'} resolved
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Security Score</div>
            <div className="stat-icon">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
          </div>
          <div className="stat-value">{securityScore}</div>
          <div className="stat-meta">
            <span>out of 100</span>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <section className="surface-panel" style={{ marginTop: '2rem' }}>
        <div className="section-header" style={{ marginBottom: '1.5rem' }}>
          <h2 className="section-title">Recent Vulnerabilities</h2>
          <a href="/issues" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>
            View all →
          </a>
        </div>

        {vulnerabilities && vulnerabilities.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Severity</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Detected</th>
                </tr>
              </thead>
              <tbody>
                {vulnerabilities.slice(0, 5).map((vuln: any) => (
                  <tr key={vuln.id}>
                    <td>
                      <span className={`badge ${vuln.severity}`}>{vuln.severity}</span>
                    </td>
                    <td style={{ fontWeight: '500' }}>{vuln.title}</td>
                    <td>
                      {vuln.status === 'merged' ? (
                        <span className="status-badge fixed">
                          <span className="status-dot fixed"></span>
                          Fixed
                        </span>
                      ) : vuln.status === 'pr_open' ? (
                        <span className="status-badge progress">
                          <span className="status-dot progress"></span>
                          PR Open
                        </span>
                      ) : (
                        <span className="status-badge open">
                          <span className="status-dot open"></span>
                          Open
                        </span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {new Date(vuln.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-title">No Vulnerabilities Found</div>
            <div className="empty-state-description">Your codebase is clean! Keep running scans to maintain security.</div>
          </div>
        )}
      </section>

      {/* On-Demand Scanner */}
      <OnDemandScanner />
    </div>
  );
}
