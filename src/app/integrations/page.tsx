import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const revalidate = 0;

export default async function IntegrationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="dashboard-container">
      <header className="page-header">
        <h1>Platform Integrations</h1>
        <p>Connect VibeGuard telemetry and patching into your existing developer environments.</p>
      </header>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        
        {/* Active GitHub Integration */}
        <div className="surface-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ background: 'var(--bg-base)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--text-main)"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>GitHub Application</h3>
              <p style={{ margin: 0, color: 'var(--success-color)', fontSize: '0.85rem', fontWeight: 600 }}>Active (Monitoring PRs)</p>
            </div>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', flex: 1 }}>
            VibeGuard is successfully installed on your organization. Target repositories are continuously scanned on push and vulnerabilities are auto-patched securely.
          </p>
          <button className="btn-primary" style={{ width: '100%', background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}>Manage Installation Configure</button>
        </div>

        {/* Pending Jira Integration */}
        <div className="surface-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', opacity: 0.6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ background: 'var(--bg-base)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#2684FF"><path d="M11.53 17.58c-3.13 0-5.69-2.56-5.69-5.69s2.56-5.69 5.69-5.69 5.69 2.56 5.69 5.69-2.56 5.69-5.69 5.69zm0-14.22c-4.7 0-8.53 3.82-8.53 8.53s3.82 8.53 8.53 8.53 8.53-3.82 8.53-8.53-3.82-8.53-8.53-8.53z"/></svg>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Jira Software</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>Enterprise Only</p>
            </div>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', flex: 1 }}>
            Automatically sync identified security warnings with Jira boards. VibeGuard auto-generates exact Jira Issues for high-severity threats.
          </p>
          <button className="btn-primary" disabled style={{ width: '100%', background: 'var(--bg-base)', color: 'var(--text-muted)' }}>Upgrade to Connect</button>
        </div>

        {/* Pending Slack Integration */}
        <div className="surface-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', opacity: 0.6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ background: 'var(--bg-base)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#E01E5A"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522v-2.521zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.523-2.522v-2.522h2.523zM15.165 17.688a2.527 2.527 0 0 1-2.523-2.523 2.526 2.526 0 0 1 2.523-2.52h6.312A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/></svg>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Slack Notifications</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>Pro Tier Only</p>
            </div>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', flex: 1 }}>
            Alert your DevSecOps team instantly when VibeGuard issues a patch or identifies a zero-day dependency threat.
          </p>
          <button className="btn-primary" disabled style={{ width: '100%', background: 'var(--bg-base)', color: 'var(--text-muted)' }}>Upgrade to Connect</button>
        </div>

      </div>
    </div>
  );
}
