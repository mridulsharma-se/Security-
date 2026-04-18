import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'VibeGuard | Security Operations',
  description: 'AI-native security agent mapping and patching critical vulnerabilities.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="background-glow" />
        <div className="background-glow second" />
        
        <nav className="navbar">
          <div className="nav-brand">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fff" />
                  <stop offset="100%" stopColor="#8a2be2" />
                </linearGradient>
              </defs>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            </svg>
            VibeGuard
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}
