'use client';

import { useState, useEffect } from 'react';
import { getUser } from '@/app/actions/auth';

type TabType = 'general' | 'behavior' | 'tokens' | 'danger';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }
      setUser(user);
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="dashboard-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  const tabs: Array<{ id: TabType; label: string; icon: string; isDanger?: boolean }> = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'behavior', label: 'Agent Behavior', icon: '🤖' },
    { id: 'tokens', label: 'API Tokens', icon: '🔑' },
    { id: 'danger', label: 'Danger Zone', icon: '⚠️', isDanger: true },
  ];

  return (
    <div className="dashboard-container">
      <header className="page-header">
        <h1>Settings & Configuration</h1>
        <p>Manage your organization policies, agent behavior, and security settings.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '2rem' }}>

        {/* Settings Sidebar */}
        <nav style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
          height: 'fit-content',
          position: 'sticky',
          top: '84px',
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              style={{
                padding: '0.75rem 1rem',
                border: 'none',
                background: activeTab === tab.id ? 'var(--bg-surface)' : 'transparent',
                borderRadius: '6px',
                color: activeTab === tab.id
                  ? (tab.isDanger ? 'var(--critical-color)' : 'var(--text-main)')
                  : 'var(--text-muted)',
                fontWeight: activeTab === tab.id ? '600' : '500',
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                borderLeft: activeTab === tab.id ? '3px solid ' + (tab.isDanger ? 'var(--critical-color)' : 'var(--accent-primary)') : '3px solid transparent',
              }}
              className="menu-item"
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Content Area */}
        <div>
          {/* General Tab */}
          {activeTab === 'general' && (
            <section className="surface-panel">
              <h2 className="section-title">Organization Profile</h2>

              <div className="form-group">
                <label>Organization Name</label>
                <input
                  type="text"
                  className="form-input"
                  disabled
                  value={user?.user_metadata?.full_name || 'Personal Workspace'}
                />
                <div className="form-hint">Managed by Identity Provider (Google OAuth)</div>
              </div>

              <div className="form-group">
                <label>Admin Email</label>
                <input
                  type="email"
                  className="form-input"
                  disabled
                  value={user?.email || ''}
                />
              </div>

              <div className="form-divider"></div>

              <h2 className="section-title">Workspace Preferences</h2>

              <div className="form-group">
                <label>Organization Timezone</label>
                <select className="form-input">
                  <option>UTC (Coordinated Universal Time)</option>
                  <option>EST (Eastern Standard Time)</option>
                  <option>CST (Central Standard Time)</option>
                  <option>MST (Mountain Standard Time)</option>
                  <option>PST (Pacific Standard Time)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Notification Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="alerts@your-domain.com"
                />
                <div className="form-hint">Receive critical security alerts at this address</div>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button className="btn btn-secondary">Cancel</button>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </section>
          )}

          {/* Agent Behavior Tab */}
          {activeTab === 'behavior' && (
            <section className="surface-panel">
              <h2 className="section-title">Autonomous Agent Rulesets</h2>

              <div className="form-section">
                <div className="form-section-title">Code Remediation Strategy</div>
                <div className="form-group">
                  <label>Auto-Fix Mode</label>
                  <select className="form-input">
                    <option value="pr">🔒 Secure Mode (Recommended) - Generate passive PR proposals for review</option>
                    <option value="commit">⚡ Aggressive Mode - Directly commit fixes to default branch</option>
                    <option value="disabled">Disabled - Report findings only</option>
                  </select>
                  <div className="form-hint">Determines how VibeGuard handles vulnerability remediation</div>
                </div>
              </div>

              <div className="form-section">
                <div className="form-section-title">Scanning Rules</div>

                <div style={{
                  padding: '1rem',
                  background: 'var(--bg-base)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}>
                  <input
                    type="checkbox"
                    id="scan_secrets"
                    defaultChecked
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <div style={{ flex: 1 }}>
                    <label htmlFor="scan_secrets" style={{ margin: 0, color: 'var(--text-main)', fontWeight: '600', cursor: 'pointer' }}>
                      Enable Deep Secret Scanning
                    </label>
                    <div className="form-hint">Search repository histories for leaked AWS keys, Stripe tokens, API keys, etc.</div>
                  </div>
                </div>

                <div style={{
                  padding: '1rem',
                  background: 'var(--bg-base)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}>
                  <input
                    type="checkbox"
                    id="scan_deps"
                    defaultChecked
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <div style={{ flex: 1 }}>
                    <label htmlFor="scan_deps" style={{ margin: 0, color: 'var(--text-main)', fontWeight: '600', cursor: 'pointer' }}>
                      Scan Vulnerable Dependencies
                    </label>
                    <div className="form-hint">Check npm, pip, and Maven packages against known vulnerability databases</div>
                  </div>
                </div>

                <div style={{
                  padding: '1rem',
                  background: 'var(--bg-base)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}>
                  <input
                    type="checkbox"
                    id="scan_sast"
                    defaultChecked
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <div style={{ flex: 1 }}>
                    <label htmlFor="scan_sast" style={{ margin: 0, color: 'var(--text-main)', fontWeight: '600', cursor: 'pointer' }}>
                      Enable SAST Analysis
                    </label>
                    <div className="form-hint">Perform static source code analysis for code injection and logic flaws</div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button className="btn btn-secondary">Cancel</button>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Rules'}
                </button>
              </div>
            </section>
          )}

          {/* API Tokens Tab */}
          {activeTab === 'tokens' && (
            <section className="surface-panel">
              <h2 className="section-title">API Authentication</h2>

              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>Active Tokens</h3>
                  <button className="btn btn-primary" style={{ fontSize: '0.9rem' }}>
                    Generate New Token
                  </button>
                </div>

                <div style={{
                  padding: '1.5rem',
                  background: 'var(--bg-base)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  marginBottom: '1rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>prod-api-key-2024</div>
                    <span className="badge success">Active</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Created 3 months ago • Last used 2 days ago
                  </div>
                  <div style={{
                    background: 'var(--bg-surface)',
                    padding: '0.75rem',
                    borderRadius: '4px',
                    fontFamily: 'Roboto Mono, monospace',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    marginBottom: '1rem',
                    wordBreak: 'break-all',
                  }}>
                    vbg_prod_••••••••••••••••••••••••••••
                  </div>
                  <button className="btn btn-danger" style={{ fontSize: '0.9rem' }}>
                    Revoke Token
                  </button>
                </div>

                <div style={{
                  padding: '1rem',
                  background: 'var(--info-bg)',
                  border: `1px solid var(--info-border)`,
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  color: 'var(--info-color)',
                }}>
                  <strong>Tip:</strong> Use API tokens to authenticate CI/CD pipelines and integrations. Never commit tokens to version control.
                </div>
              </div>
            </section>
          )}

          {/* Danger Zone Tab */}
          {activeTab === 'danger' && (
            <section className="surface-panel">
              <div className="form-section danger">
                <div className="form-section-title">Delete Organization</div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Permanently delete your organization and all associated data. This action cannot be undone.
                </p>
                <button className="btn btn-danger">
                  Delete Organization
                </button>
              </div>

              <div className="form-section danger" style={{ marginTop: '2rem' }}>
                <div className="form-section-title">Reset All Settings</div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Reset all security rules, agent behavior, and integration configurations to factory defaults.
                </p>
                <button className="btn btn-danger">
                  Reset Settings
                </button>
              </div>

              <div className="form-section danger" style={{ marginTop: '2rem' }}>
                <div className="form-section-title">Revoke All Tokens</div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Immediately invalidate all API tokens. Any running integrations will fail and require new tokens.
                </p>
                <button className="btn btn-danger">
                  Revoke All Tokens
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
