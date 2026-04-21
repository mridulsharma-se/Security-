'use client';

import { useState } from 'react';

export default function OnDemandScanner() {
  const [activeTab, setActiveTab] = useState<'repo' | 'snippet' | 'website'>('website');

  // Snippet State
  const [source, setSource] = useState('');
  const [filePath, setFilePath] = useState('app/test/route.ts');
  const [artifactKind, setArtifactKind] = useState('route');

  // Repo State
  const [repoUrl, setRepoUrl] = useState('');
  const [branch, setBranch] = useState('main');

  // Website State
  const [websiteUrl, setWebsiteUrl] = useState('');

  // Shared State
  const [loading, setLoading] = useState(false);
  const [findings, setFindings] = useState<any[] | null>(null);
  const [scanMetadata, setScanMetadata] = useState<any>(null);

  const handleScanSnippet = async () => {
    setLoading(true);
    setFindings(null);
    setScanMetadata(null);
    try {
      const res = await fetch('/api/scan/live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, filePath, artifactKind })
      });
      const data = await res.json();
      if (data.ok && data.findings) {
        setFindings(data.findings);
      } else {
        alert('Scan failed: ' + data.error);
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleScanRepo = async () => {
    setLoading(true);
    setFindings(null);
    setScanMetadata(null);
    try {
      let owner = repoUrl;
      const res = await fetch('/api/scan/repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner, repo: '', branch })
      });
      const data = await res.json();
      if (data.ok) {
        setFindings(data.findings || []);
        setScanMetadata({ scannedCount: data.scannedCount, totalFiles: data.totalFiles });
      } else {
        alert('Repo scan failed: ' + data.error);
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleScanWebsite = async () => {
    setLoading(true);
    setFindings(null);
    setScanMetadata(null);
    try {
      const res = await fetch('/api/scan/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: websiteUrl })
      });
      const data = await res.json();
      if (data.ok) {
        setFindings(data.findings || []);
        setScanMetadata({ isWebsite: true, status: data.status });
      } else {
        alert('Website scan failed: ' + data.error);
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const scanIcons = {
    website: '🌐',
    repo: '📦',
    snippet: '💻',
  };

  return (
    <div className="surface-panel" style={{ marginTop: '2.5rem' }}>
      <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: 'none', marginBottom: '1.5rem' }}>
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.5 1h-8C6.12 1 5 2.12 5 3.5v17C5 21.88 6.12 23 7.5 23h8c1.38 0 2.5-1.12 2.5-2.5v-17C18 2.12 16.88 1 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h8v14z" />
        </svg>
        On-Demand Security Testing
      </h2>

      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
        Run manual security scans against your code, repositories, and live applications. Get immediate vulnerability reports with actionable remediation guidance.
      </p>

      <div className="tabs-container">
        <button
          className={`tab-btn ${activeTab === 'website' ? 'active' : ''}`}
          onClick={() => setActiveTab('website')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <span style={{ fontSize: '1.1rem' }}>🌐</span>
          Dynamic Web Scan (DAST)
        </button>
        <button
          className={`tab-btn ${activeTab === 'repo' ? 'active' : ''}`}
          onClick={() => setActiveTab('repo')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <span style={{ fontSize: '1.1rem' }}>📦</span>
          Repository Scan (SAST)
        </button>
        <button
          className={`tab-btn ${activeTab === 'snippet' ? 'active' : ''}`}
          onClick={() => setActiveTab('snippet')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <span style={{ fontSize: '1.1rem' }}>💻</span>
          Code Sandbox
        </button>
      </div>

      {activeTab === 'website' && (
        <div style={{ paddingBottom: '1.5rem' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Analyze any live URL for security vulnerabilities. Detects unsafe HTTP headers, XSS vectors, DOM-based flaws, and server misconfigurations.
          </p>
          <div className="form-group">
            <label>Target Website URL</label>
            <input
              type="url"
              className="form-input"
              value={websiteUrl}
              onChange={e => setWebsiteUrl(e.target.value)}
              placeholder="https://www.example.com"
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={handleScanWebsite}
            disabled={loading || !websiteUrl.trim()}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ width: '14px', height: '14px' }}></span>
                Running DAST Analysis...
              </>
            ) : (
              <>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11 17H9v2h2v-2zm4-12H9v2h6V5zm0 4H9v2h6V9zm2 8h-2v2h2v-2zm2-8h-6v2h6V9zm0 4h-6v2h6v-2z" />
                </svg>
                Execute Scan
              </>
            )}
          </button>
        </div>
      )}

      {activeTab === 'repo' && (
        <div style={{ paddingBottom: '1.5rem' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Scan a GitHub repository for vulnerable dependencies, hardcoded secrets, and dangerous code patterns.
          </p>
          <div className="form-row">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Repository (owner/name)</label>
              <input
                type="text"
                className="form-input"
                value={repoUrl}
                onChange={e => setRepoUrl(e.target.value)}
                placeholder="e.g. anthropics/claude-code"
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Branch</label>
              <input
                type="text"
                className="form-input"
                value={branch}
                onChange={e => setBranch(e.target.value)}
                placeholder="main"
              />
            </div>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleScanRepo}
            disabled={loading || !repoUrl.trim()}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ width: '14px', height: '14px' }}></span>
                Analyzing Repository...
              </>
            ) : (
              <>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11 17H9v2h2v-2zm4-12H9v2h6V5zm0 4H9v2h6V9zm2 8h-2v2h2v-2zm2-8h-6v2h6V9zm0 4h-6v2h6v-2z" />
                </svg>
                Scan Repository
              </>
            )}
          </button>
        </div>
      )}

      {activeTab === 'snippet' && (
        <div style={{ paddingBottom: '1.5rem' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Paste code snippets to get real-time vulnerability analysis. Excellent for testing new functions before deployment.
          </p>
          <div className="form-row">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>File Path</label>
              <input
                type="text"
                className="form-input"
                value={filePath}
                onChange={e => setFilePath(e.target.value)}
                placeholder="app/api/route.ts"
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Artifact Type</label>
              <select
                className="form-input"
                value={artifactKind}
                onChange={e => setArtifactKind(e.target.value)}
              >
                <option value="route">API Route</option>
                <option value="server_action">Server Action</option>
                <option value="sql_schema">SQL Schema</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Source Code</label>
            <textarea
              className="form-input"
              value={source}
              onChange={e => setSource(e.target.value)}
              placeholder="Paste your code here..."
              rows={8}
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={handleScanSnippet}
            disabled={loading || !source.trim()}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ width: '14px', height: '14px' }}></span>
                Analyzing Code...
              </>
            ) : (
              <>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11 17H9v2h2v-2zm4-12H9v2h6V5zm0 4H9v2h6V9zm2 8h-2v2h2v-2zm2-8h-6v2h6V9zm0 4h-6v2h6v-2z" />
                </svg>
                Analyze Code
              </>
            )}
          </button>
        </div>
      )}

      {findings && (
        <div style={{ marginTop: '2.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>
              Scan Results
            </h3>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <span className="chip">
                {findings.length} finding{findings.length !== 1 ? 's' : ''}
              </span>
              {scanMetadata && scanMetadata.isWebsite ? (
                <span className="chip">
                  HTTP {scanMetadata.status}
                </span>
              ) : scanMetadata ? (
                <span className="chip">
                  {scanMetadata.scannedCount}/{scanMetadata.totalFiles} files scanned
                </span>
              ) : null}
            </div>
          </div>

          {findings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg width="40" height="40" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <div className="empty-state-title">No Vulnerabilities Found</div>
              <div className="empty-state-description">This target passes security validation. Great work!</div>
            </div>
          ) : (
            <div className="vuln-list">
              {findings.map((f, i) => (
                <div
                  key={i}
                  style={{
                    padding: '1.5rem',
                    background: 'var(--bg-base)',
                    borderRadius: '6px',
                    borderLeft: `4px solid var(--${f.severity}-color, var(--text-muted))`,
                    marginBottom: i < findings.length - 1 ? '1rem' : 0,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <h4 style={{ margin: 0, flex: 1 }}>{f.title}</h4>
                    <span className={`badge ${f.severity}`} style={{ marginLeft: '1rem', flexShrink: 0 }}>
                      {f.severity}
                    </span>
                  </div>

                  {f.file_path && (
                    <div className="table-cell-mono" style={{ marginBottom: '1rem' }}>
                      {f.file_path}:{f.line_start}
                    </div>
                  )}

                  <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                    {f.exploit_narrative}
                  </p>

                  <div>
                    <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: '600', letterSpacing: '0.5px' }}>
                      Proof of Concept
                    </div>
                    <div style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      padding: '1rem',
                      borderRadius: '4px',
                      border: '1px solid var(--border-subtle)',
                      overflowX: 'auto',
                    }}>
                      <pre style={{
                        fontSize: '0.8rem',
                        whiteSpace: 'pre-wrap',
                        color: 'var(--text-main)',
                        margin: 0,
                        fontFamily: 'Roboto Mono, monospace',
                        lineHeight: '1.5',
                      }}>
                        {f.proof_of_concept}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
