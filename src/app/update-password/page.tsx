'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });
      
      if (updateError) throw updateError;
      
      setMessage('Password updated successfully! Redirecting...');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--accent-primary)', fontFamily: 'Outfit, sans-serif' }}>
          Secure New Password
        </h2>
        
        {error && (
          <div style={{ background: 'rgba(255, 77, 79, 0.1)', border: '1px solid var(--critical-color)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', color: 'white', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{ background: 'rgba(82, 196, 26, 0.1)', border: '1px solid var(--success-color)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', color: 'white', fontSize: '0.9rem' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>New Password</label>
            <input 
              type="password" 
              className="form-input" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••" 
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Confirm Password</label>
            <input 
              type="password" 
              className="form-input" 
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••" 
            />
          </div>
          
          <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Securing Vault...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
