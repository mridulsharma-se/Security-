import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const revalidate = 0;

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="dashboard-container">
      <header className="page-header">
        <h1>Rules & Configuration</h1>
        <p>Modify agent behavior, access keys, and organization policies.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem' }}>
        
        {/* Navigation Sidebar for settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
           <div className="menu-item active" style={{ background: 'var(--bg-surface)' }}>General Info</div>
           <div className="menu-item">Agent Behavior</div>
           <div className="menu-item">API Tokens</div>
           <div className="menu-item" style={{ color: 'var(--critical-color)' }}>Danger Zone</div>
        </div>

        {/* General Form */}
        <section className="surface-panel">
          <h2 className="section-title">General Organization Profile</h2>
          
          <div className="form-group">
            <label>Organization Name</label>
            <input type="text" className="form-input" disabled value={user.user_metadata?.full_name || 'Personal Workspace'} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Managed by Identity Provider (Google OAuth)</span>
          </div>

          <div className="form-group">
            <label>Admin Email</label>
            <input type="email" className="form-input" disabled value={user.email || ''} />
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '2rem 0' }} />

          <h2 className="section-title">Autonomous Agent Rulesets</h2>
          <div className="form-group">
            <label>Code Remediation Strategy</label>
            <select className="form-input">
              <option value="pr">Secure - Generate passive PR Proposals (Recommended)</option>
              <option value="commit">Aggressive - Direct Commit (Bypass PRs)</option>
            </select>
          </div>
          
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}>
            <input type="checkbox" id="scan_secrets" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }} />
            <div style={{ flex: 1 }}>
              <label htmlFor="scan_secrets" style={{ margin: 0, color: 'var(--text-main)' }}>Enable Deep Secret Scanning</label>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Search repository histories for leaked AWS keys, Stripe tokens, etc.</span>
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
             <button className="btn-primary">Save Configuration</button>
          </div>

        </section>
      </div>

    </div>
  );
}
