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
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
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
        router.push('/');
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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--accent-primary)', fontFamily: 'Outfit, sans-serif' }}>
          {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
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

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {(mode === 'login' || mode === 'signup') && (
            <>
              <button 
                type="button" 
                onClick={handleGoogleAuth}
                className="btn-primary" 
                style={{ 
                  background: 'white', 
                  color: '#333', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '0.75rem',
                  border: '1px solid #ddd'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
              
              <div style={{ display: 'flex', alignItems: 'center', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--panel-border)' }} />
                <span style={{ margin: '0 1rem' }}>OR</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--panel-border)' }} />
              </div>
            </>
          )}

          {mode === 'signup' && (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Operator Alias (Full Name)</label>
              <input 
                type="text" 
                className="form-input" 
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                placeholder="ex: Cyber Commander" 
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
              placeholder="operator@vibeguard.dev" 
            />
          </div>

          {mode !== 'forgot' && (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                Password
                {mode === 'login' && (
                  <button 
                    type="button" 
                    onClick={() => setMode('forgot')} 
                    style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontSize: '0.8rem', padding: 0 }}
                  >
                    Forgot Password?
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
          
          <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Authenticating...' : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Sign Up' : 'Send Reset Link'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {mode === 'login' && (
            <>
              Don't have an account? <button onClick={() => setMode('signup')} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', textDecoration: 'underline' }}>Sign up</button>
            </>
          )}
          {(mode === 'signup' || mode === 'forgot') && (
            <>
              Remembered your password? <button onClick={() => setMode('login')} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', textDecoration: 'underline' }}>Sign in</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
