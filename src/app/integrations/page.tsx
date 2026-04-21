import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const revalidate = 0;

export default async function IntegrationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const integrations = [
    {
      id: 'github',
      name: 'GitHub',
      description: 'Scan repositories and automatically create fix PRs',
      logo: 'GH',
      status: 'connected',
      connected: true,
      features: ['Repository scanning', 'Automated fix PRs', 'Webhook integration'],
    },
    {
      id: 'jira',
      name: 'Jira Software',
      description: 'Create and track issues for security findings',
      logo: 'JI',
      status: 'enterprise',
      connected: false,
      features: ['Issue creation', 'Automatic assignment', 'Status tracking'],
      tier: 'Enterprise',
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Real-time notifications for critical vulnerabilities',
      logo: 'SL',
      status: 'enterprise',
      connected: false,
      features: ['Real-time alerts', 'Channel routing', 'Digest reports'],
      tier: 'Pro',
    },
    {
      id: 'datadog',
      name: 'Datadog',
      description: 'Send security metrics to Datadog dashboards',
      logo: 'DD',
      status: 'disconnected',
      connected: false,
      features: ['Metrics export', 'Dashboard integration', 'Custom tagging'],
    },
    {
      id: 'azure',
      name: 'Azure DevOps',
      description: 'Integrate with Azure Pipelines for CI/CD security',
      logo: 'AD',
      status: 'disconnected',
      connected: false,
      features: ['Pipeline integration', 'Work item creation', 'Status checks'],
    },
    {
      id: 'gitlab',
      name: 'GitLab',
      description: 'Connect GitLab repositories and merge requests',
      logo: 'GL',
      status: 'disconnected',
      connected: false,
      features: ['Repository scanning', 'MR integration', 'SAST scanning'],
    },
  ];

  return (
    <div className="dashboard-container">
      <header className="page-header">
        <h1>Platform Integrations</h1>
        <p>Connect and manage integrations with development and security platforms to automate your security workflows.</p>
      </header>

      <div className="stats-grid">
        {integrations.map((integration) => (
          <div key={integration.id} className="integration-card">
            <div className="integration-header">
              <div className="integration-logo">
                {integration.logo}
              </div>
              <div className="integration-status" style={{
                background: integration.status === 'connected'
                  ? 'rgba(16, 185, 129, 0.1)'
                  : integration.status === 'enterprise'
                  ? 'var(--accent-dim)'
                  : 'rgba(107, 114, 128, 0.1)',
                color: integration.status === 'connected'
                  ? 'var(--success-color)'
                  : integration.status === 'enterprise'
                  ? 'var(--accent-primary)'
                  : 'var(--text-secondary)',
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor' }}></span>
                {integration.status === 'connected' ? 'Connected' : integration.status === 'enterprise' ? 'Upgrade' : 'Disconnected'}
              </div>
            </div>

            <div className="integration-info">
              <div className="integration-title">{integration.name}</div>
              <div className="integration-description">
                {integration.description}
              </div>
              <ul className="integration-features">
                {integration.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
              {integration.connected ? (
                <button className="btn btn-secondary" style={{ flex: 1 }}>
                  Manage
                </button>
              ) : integration.status === 'enterprise' ? (
                <button className="btn btn-primary" style={{ flex: 1 }}>
                  Upgrade to {integration.tier}
                </button>
              ) : (
                <button className="btn btn-primary" style={{ flex: 1 }}>
                  Connect
                </button>
              )}
              <button className="btn btn-ghost">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11 17H9v2h2v-2zm4-12H9v2h6V5zm0 4H9v2h6V9zm2 8h-2v2h2v-2zm2-8h-6v2h6V9zm0 4h-6v2h6v-2z"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Start Section */}
      <section className="surface-panel" style={{ marginTop: '2.5rem' }}>
        <h2 className="section-title">Getting Started</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div style={{
            padding: '1.5rem',
            background: 'var(--accent-light)',
            border: '1px solid var(--accent-dim)',
            borderRadius: '6px',
          }}>
            <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
              Step 1: Connect GitHub
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Install the VibeGuard app to your GitHub account to enable automatic repository scanning.
            </p>
            <a href="#" className="btn btn-ghost" style={{ fontSize: '0.85rem' }}>
              Install App →
            </a>
          </div>

          <div style={{
            padding: '1.5rem',
            background: 'rgba(99, 102, 241, 0.05)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            opacity: 0.6,
          }}>
            <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Step 2: Configure Webhooks
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Set up webhooks to trigger scans on code pushes and pull requests.
            </p>
            <a href="#" className="btn btn-ghost" style={{ fontSize: '0.85rem', opacity: 0.5, pointerEvents: 'none' }}>
              View Docs
            </a>
          </div>

          <div style={{
            padding: '1.5rem',
            background: 'rgba(99, 102, 241, 0.05)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            opacity: 0.6,
          }}>
            <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Step 3: Enable Auto-Fixes
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Allow VibeGuard to automatically create pull requests with fixes for found vulnerabilities.
            </p>
            <a href="/settings" className="btn btn-ghost" style={{ fontSize: '0.85rem' }}>
              Configure →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
