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
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) throw updateError;

      setMessage('✓ Password updated successfully! Redirecting to dashboard...');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = password.length >= 8 ? 'strong' : password.length >= 6 ? 'medium' : 'weak';

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      minHeight: '100vh',
      background: 'var(--bg-base)',
    }}>
      {/* Left: Brand Panel */}
      <div style={{
        background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-hover) 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
        color: 'white',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{
            fontSize: '3.5rem',
            fontWeight: '700',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            </svg>
            VibeGuard
          </div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '2rem',
            lineHeight: '1.3',
          }}>
            Secure Your Account
          </h1>

          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '8px',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}>
            <div style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: '600', textAlign: 'left' }}>
              Security Tips
            </div>
            <ul style={{
              listStyle: 'none',
              fontSize: '0.95rem',
              lineHeight: '1.8',
              textAlign: 'left',
            }}>
              <li>✓ Use a strong, unique password</li>
              <li>✓ Avoid personal information</li>
              <li>✓ Include uppercase, lowercase & numbers</li>
              <li>✓ At least 12 characters recommended</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right: Password Reset Form */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
      }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'var(--accent-dim)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: 'var(--accent-primary)',
            }}>
              <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S15.33 8 14.5 8 13 8.67 13 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S8.33 8 7.5 8 6 8.67 6 9.5 6.67 11 7.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
              </svg>
            </div>
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              marginBottom: '0.5rem',
              color: 'var(--text-main)',
            }}>
              Secure New Password
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Create a strong password to protect your account
            </p>
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <div className="alert-content">{error}</div>
            </div>
          )}

          {message && (
            <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <div className="alert-content">{message}</div>
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
                minLength={8}
              />
              <div className="form-hint">At least 8 characters</div>
              {password && (
                <div style={{
                  marginTop: '0.5rem',
                  display: 'flex',
                  gap: '0.25rem',
                }}>
                  <div style={{
                    flex: 1,
                    height: '4px',
                    background: passwordStrength === 'weak' ? 'var(--critical-color)' : passwordStrength === 'medium' ? 'var(--warning-color)' : 'var(--success-color)',
                    borderRadius: '2px',
                  }}></div>
                  <div style={{
                    flex: 1,
                    height: '4px',
                    background: passwordStrength !== 'weak' ? 'var(--warning-color)' : 'var(--border-subtle)',
                    borderRadius: '2px',
                  }}></div>
                  <div style={{
                    flex: 1,
                    height: '4px',
                    background: passwordStrength === 'strong' ? 'var(--success-color)' : 'var(--border-subtle)',
                    borderRadius: '2px',
                  }}></div>
                </div>
              )}
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
                minLength={8}
              />
              {confirmPassword && password === confirmPassword && (
                <div className="form-hint" style={{ color: 'var(--success-color)' }}>
                  ✓ Passwords match
                </div>
              )}
              {confirmPassword && password !== confirmPassword && (
                <div className="form-hint" style={{ color: 'var(--critical-color)' }}>
                  Passwords do not match
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem 1.5rem' }}
              disabled={loading || password !== confirmPassword || password.length < 8}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ width: '14px', height: '14px' }}></span>
                  Securing Account...
                </>
              ) : (
                'Update Password'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Responsive */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          body > div > div {
            grid-template-columns: 1fr !important;
          }
          body > div > div > div:first-child {
            display: none !important;
          }
        }
      `}} />
    </div>
  );
}
