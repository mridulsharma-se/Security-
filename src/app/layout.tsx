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

  const userInitial = user ? (user.user_metadata?.full_name || 'U').charAt(0).toUpperCase() : '';

  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          {user && <Sidebar user={user} />}

          <main className={user ? "main-content" : "main-content-full"} style={{ flex: 1 }}>
            {user && (
              <header className="navbar">
                <div className="navbar-left">
                  <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>
                    {user.user_metadata?.full_name || 'Personal Workspace'}
                  </span>
                </div>
                <div className="navbar-right">
                  <div className="navbar-avatar" title={user.email}>
                    {userInitial}
                  </div>
                  <SignOutButton />
                </div>
              </header>
            )}
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
