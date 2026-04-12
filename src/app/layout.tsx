import type { ReactNode } from 'react';

export const metadata = {
  title: 'VibeGuard',
  description: 'AI-native security agent for AI-generated code.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
