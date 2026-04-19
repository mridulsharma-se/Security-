import type { ReactNode } from 'react';
import './globals.css';
import { createClient } from '@/lib/supabase/server';
import SignOutButton from './components/SignOutButton';
import Sidebar from './components/Sidebar';

export const metadata = {
  title: 'VibeGuard | Security Operations',
  description: 'AI-native security agent mapping and patching critical vulnerabilities.',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          {user && <Sidebar />}

          <main className={user ? "main-content" : "main-content-full"} style={{ flex: 1, ...(!user ? { marginLeft: 0 } : {}) }}>
            {user && (
              <header className="navbar">
                <div style={{ flex: 1, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Organization: <strong style={{ color: 'var(--text-main)' }}>{user.user_metadata?.full_name || 'Personal Workspace'}</strong>
                </div>
                <SignOutButton />
              </header>
            )}
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
