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
    <main className="dashboard-container">
      <div className="background-glow"></div>
      <div className="background-glow second"></div>

      <header className="page-header">
        <h1>VibeGuard Security Operations</h1>
        <p>Real-time autonomous vulnerability detection and healing for your entire codebase.</p>
      </header>

      {/* Onboarding & Status Panel */}
      <section className="glass-panel pulse" style={{ padding: '1.5rem', marginBottom: '2rem', borderLeft: '4px solid var(--accent-primary)' }}>
        <h3 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          System Shield Active
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          VibeGuard is currently monitoring installed Webhooks. When you push code or open Pull Requests on connected GitHub Apps, background agents will automatically review changes, identify vulnerabilities, and proactively submit patch patches. You can review all real-time events below, or run point-in-time scans using the On-Demand tools at the bottom.
        </p>
      </section>

      <div className="stats-grid">
        <div className="glass-panel">
          <div className="stat-title" style={{ color: 'var(--critical-color)' }}>Critical Threats Detected</div>
          <div className="stat-value">{stats.critical}</div>
        </div>
        <div className="glass-panel">
          <div className="stat-title" style={{ color: 'var(--high-color)' }}>High Severity Threats</div>
          <div className="stat-value">{stats.high}</div>
        </div>
        <div className="glass-panel">
          <div className="stat-title" style={{ color: 'var(--success-color)' }}>Patched Automatically</div>
          <div className="stat-value">{stats.healed}</div>
        </div>
      </div>

      <section className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 className="section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
          Continuous Event Monitoring
        </h2>

        {!vulnerabilities || vulnerabilities.length === 0 ? (
          <div className="empty-state" style={{ padding: '4rem 2rem' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem' }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            </svg>
            <p>No webhook vulnerabilities detected yet. Waiting for incoming pushes...</p>
          </div>
        ) : (
          <div className="vuln-list">
            {vulnerabilities.map((vuln) => (
              <div key={vuln.id} className="vuln-item">
                <div className="vuln-info">
                  <h4>{vuln.title}</h4>
                  <div className="vuln-meta" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--text-main)' }}>{vuln.repositories?.full_name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>•</span>
                    <span style={{ fontFamily: 'monospace' }}>{vuln.file_path}:{vuln.line_start}</span>
                    <span style={{ color: 'var(--text-muted)' }}>•</span>
                    <span suppressHydrationWarning>{new Date(vuln.created_at).toLocaleString()}</span>
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

      <OnDemandScanner />
    </main>
  );
}
