'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', overflow: 'hidden' }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: '3rem',
        paddingRight: '3rem',
        background: 'rgba(10, 13, 23, 0.8)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--border-subtle)',
        zIndex: 1000,
      }}>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: 'var(--text-main)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--accent-primary)" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
          </svg>
          VibeGuard
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <a href="/login" style={{
            color: 'var(--text-muted)',
            textDecoration: 'none',
            fontSize: '0.95rem',
            fontWeight: '500',
            transition: 'color 0.3s',
            cursor: 'pointer',
          }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-main)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>
            Login
          </a>
          <button onClick={() => router.push('/login')} style={{
            padding: '0.6rem 1.5rem',
            background: 'var(--accent-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }} onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-hover)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--accent-primary)')}>
            Sign up
          </button>
        </div>
      </nav>

      {/* Hero Section with Animated Background */}
      <section style={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '70px',
        overflow: 'hidden',
      }}>
        {/* Animated Background Grid */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at ${25 + scrollY * 0.1}% ${25 + scrollY * 0.1}%,
              rgba(168, 85, 247, 0.15) 0%,
              transparent 50%),
            radial-gradient(circle at ${75 - scrollY * 0.1}% ${75 + scrollY * 0.15}%,
              rgba(59, 130, 246, 0.15) 0%,
              transparent 50%)
          `,
          pointerEvents: 'none',
        }} />

        {/* Animated Grid Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
          backgroundPosition: `0px ${scrollY * 0.5}px`,
          pointerEvents: 'none',
        }} />

        {/* Content */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          maxWidth: '900px',
          paddingLeft: '2rem',
          paddingRight: '2rem',
        }}>
          <div style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            background: 'rgba(168, 85, 247, 0.15)',
            borderRadius: '50px',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            marginBottom: '2rem',
            fontSize: '0.85rem',
            fontWeight: '600',
            color: 'var(--accent-primary)',
          }}>
            ✨ Meet VibeGuard: The AI Security Fabric
          </div>

          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '700',
            lineHeight: '1.2',
            marginBottom: '1.5rem',
            color: 'var(--text-main)',
            background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-hover) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Unleash AI Innovators Securely
          </h1>

          <p style={{
            fontSize: '1.2rem',
            lineHeight: '1.8',
            color: 'var(--text-secondary)',
            marginBottom: '3rem',
            maxWidth: '700px',
            margin: '0 auto 3rem',
          }}>
            A new autonomous defense architecture designed for an era where code creation has accelerated beyond human capacity. Weave an invisible, intelligent layer of defense into every creation.
          </p>

          <div style={{
            display: 'flex',
            gap: '1.5rem',
            justifyContent: 'center',
            marginBottom: '4rem',
          }}>
            <button onClick={() => router.push('/login')} style={{
              padding: '1rem 2.5rem',
              background: 'var(--accent-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 8px 24px rgba(168, 85, 247, 0.3)',
            }} onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--accent-hover)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(168, 85, 247, 0.4)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--accent-primary)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(168, 85, 247, 0.3)';
            }}>
              Explore the platform
            </button>
            <button onClick={() => {}} style={{
              padding: '1rem 2.5rem',
              background: 'transparent',
              color: 'var(--text-main)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }} onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
              e.currentTarget.style.background = 'rgba(168, 85, 247, 0.1)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.background = 'transparent';
            }}>
              Book a live demo →
            </button>
          </div>

          {/* Stats Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            maxWidth: '600px',
            margin: '0 auto',
            paddingTop: '2rem',
            borderTop: '1px solid var(--border-subtle)',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
                99.9%
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Threat Detection Accuracy
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
                24/7
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Continuous Monitoring
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
                &lt;5min
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Mean Response Time
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        position: 'relative',
        zIndex: 20,
        paddingTop: '6rem',
        paddingBottom: '6rem',
        paddingLeft: '2rem',
        paddingRight: '2rem',
        background: 'var(--bg-base)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              marginBottom: '1rem',
              color: 'var(--text-main)',
            }}>
              Enterprise-Grade Security
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: 'var(--text-secondary)',
              maxWidth: '600px',
              margin: '0 auto',
            }}>
              Comprehensive protection powered by AI and autonomous agents
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
          }}>
            {[
              { icon: '🛡️', title: 'Real-time Detection', desc: 'Identify vulnerabilities instantly as code changes' },
              { icon: '🤖', title: 'AI-Powered Remediation', desc: 'Automated fix generation and PR creation' },
              { icon: '🔄', title: 'Continuous Monitoring', desc: '24/7 scanning and threat assessment' },
              { icon: '🔗', title: 'Deep Integrations', desc: 'GitHub, GitLab, Jira, Slack and more' },
              { icon: '📊', title: 'Compliance Reports', desc: 'Export detailed security audit trails' },
              { icon: '⚡', title: 'Lightning Fast', desc: 'Scan and fix in under 5 minutes' },
            ].map((feature, idx) => (
              <div key={idx} style={{
                padding: '2rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                transition: 'all 0.3s',
                cursor: 'pointer',
              }} onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                e.currentTarget.style.background = 'rgba(168, 85, 247, 0.05)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.background = 'var(--bg-card)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{feature.icon}</div>
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  marginBottom: '0.5rem',
                  color: 'var(--text-main)',
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '0.95rem',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.6',
                }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        position: 'relative',
        zIndex: 20,
        paddingTop: '6rem',
        paddingBottom: '6rem',
        paddingLeft: '2rem',
        paddingRight: '2rem',
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            color: 'var(--text-main)',
          }}>
            Ready to Secure Your Code?
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-secondary)',
            marginBottom: '2rem',
            lineHeight: '1.8',
          }}>
            Join thousands of developers and enterprises using VibeGuard to protect their code from vulnerabilities. Start with a free trial today.
          </p>
          <button onClick={() => router.push('/login')} style={{
            padding: '1rem 3rem',
            background: 'var(--accent-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 8px 24px rgba(168, 85, 247, 0.3)',
          }} onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--accent-hover)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--accent-primary)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        position: 'relative',
        zIndex: 20,
        paddingTop: '4rem',
        paddingBottom: '4rem',
        paddingLeft: '2rem',
        paddingRight: '2rem',
        background: 'var(--bg-base)',
        borderTop: '1px solid var(--border-subtle)',
        textAlign: 'center',
      }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          © 2024 VibeGuard. All rights reserved. Enterprise security for AI innovators.
        </p>
      </footer>
    </div>
  );
}
