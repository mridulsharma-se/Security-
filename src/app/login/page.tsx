'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');

  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const supabase = createClient();
      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        });
        if (signUpError) throw signUpError;
        setMessage('Signup successful! Please check your email for a confirmation link.');
        setMode('login');
      } else if (mode === 'forgot') {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/update-password`,
        });
        if (resetError) throw resetError;
        setMessage('Password reset instructions sent. Please check your email inbox.');
        setMode('login');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      if (oauthError) throw oauthError;
    } catch (err: any) {
      setError(err.message || 'OAuth initialization failed');
      setLoading(false);
    }
  };

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
            marginBottom: '1rem',
            lineHeight: '1.3',
          }}>
            Enterprise Security Operations
          </h1>
          <p style={{
            fontSize: '1.1rem',
            opacity: 0.95,
            lineHeight: '1.6',
            marginBottom: '2rem',
          }}>
            AI-native vulnerability detection, autonomous remediation, and continuous security monitoring for your enterprise.
          </p>

          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '8px',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}>
            <div style={{ fontSize: '0.9rem', marginBottom: '1rem', fontWeight: '600' }}>
              Key Features
            </div>
            <ul style={{
              listStyle: 'none',
              fontSize: '0.9rem',
              lineHeight: '1.8',
            }}>
              <li>✓ Real-time vulnerability detection</li>
              <li>✓ Automated fix generation & PRs</li>
              <li>✓ 24/7 continuous monitoring</li>
              <li>✓ Enterprise integrations</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right: Auth Form */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
      }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              marginBottom: '0.5rem',
              color: 'var(--text-main)',
            }}>
              {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {mode === 'login'
                ? 'Sign in to your security dashboard'
                : mode === 'signup'
                ? 'Join VibeGuard enterprise security'
                : 'Enter your email to reset your password'}
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

          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {(mode === 'login' || mode === 'signup') && (
              <>
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="btn btn-secondary"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    background: 'var(--bg-card)',
                  }}
                  disabled={loading}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.5rem 0' }}>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '600' }}>Or</span>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
                </div>
              </>
            )}

            {mode === 'signup' && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  placeholder="Your name"
                />
              </div>
            )}

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Email Address</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
              />
            </div>

            {mode !== 'forgot' && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  Password
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent-primary)',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        padding: 0,
                        fontWeight: '500',
                      }}
                    >
                      Forgot?
                    </button>
                  )}
                </label>
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem 1.5rem' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ width: '14px', height: '14px' }}></span>
                  Authenticating...
                </>
              ) : (
                mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'
              )}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {mode === 'login' && (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => setMode('signup')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-primary)',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontWeight: '600',
                    padding: 0,
                  }}
                >
                  Sign up
                </button>
              </>
            )}
            {(mode === 'signup' || mode === 'forgot') && (
              <>
                Know your password?{' '}
                <button
                  onClick={() => setMode('login')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-primary)',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontWeight: '600',
                    padding: 0,
                  }}
                >
                  Sign in
                </button>
              </>
            )}
          </div>
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
