'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <button 
      onClick={handleSignOut}
      style={{
        background: 'transparent',
        border: '1px solid var(--panel-border)',
        color: 'var(--text-muted)',
        padding: '0.4rem 1rem',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '600'
      }}
    >
      Sign Out
    </button>
  );
}
