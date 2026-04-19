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

  return (
    <div className="surface-panel" style={{ marginTop: '2.5rem' }}>
      <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: 'none', marginBottom: '1.5rem' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        Manual Test Utilities
      </h2>
      
      <div className="tabs-container">
        <button 
          className={`tab-btn ${activeTab === 'website' ? 'active' : ''}`}
          onClick={() => setActiveTab('website')}
        >
          Dynamic Web Scan (DAST)
        </button>
        <button 
          className={`tab-btn ${activeTab === 'repo' ? 'active' : ''}`}
          onClick={() => setActiveTab('repo')}
        >
          Repo Scan (SAST)
        </button>
        <button 
          className={`tab-btn ${activeTab === 'snippet' ? 'active' : ''}`}
          onClick={() => setActiveTab('snippet')}
        >
          Code Sandbox
        </button>
      </div>

      {activeTab === 'website' && (
        <div className="scan-form">
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Run a dynamic analysis against any live URL. Identifies HTTP Security Headers, cross-site scripting windows, and unsafe DOM behaviors.
          </p>
          <div className="form-group">
            <label>Live Target URL</label>
            <input 
              type="url" 
              className="form-input"
              value={websiteUrl} 
              onChange={e => setWebsiteUrl(e.target.value)} 
              placeholder="https://www.example.com" 
            />
          </div>
          <button 
            className="btn-primary"
            onClick={handleScanWebsite} 
            disabled={loading || !websiteUrl.trim()}
          >
            {loading ? 'Running DAST Scan...' : 'Execute Live Scan'}
          </button>
        </div>
      )}

      {activeTab === 'repo' && (
        <div className="scan-form">
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Point VibeGuard at a public GitHub repository. Scans codebase structure for exploitable vulnerabilities.
          </p>
          <div className="form-group">
            <label>Repository Definition (Owner/Repo)</label>
            <input 
              type="text" 
              className="form-input"
              value={repoUrl} 
              onChange={e => setRepoUrl(e.target.value)} 
              placeholder="e.g. mridulsharma/Security-" 
            />
          </div>
          <div className="form-group">
            <label>Target Branch</label>
            <input 
              type="text" 
              className="form-input"
              value={branch} 
              onChange={e => setBranch(e.target.value)} 
              placeholder="main" 
            />
          </div>
          <button 
            className="btn-primary"
            onClick={handleScanRepo} 
            disabled={loading || !repoUrl.trim()}
          >
            {loading ? 'Analyzing Source Code...' : 'Audit Repository'}
          </button>
        </div>
      )}

      {activeTab === 'snippet' && (
        <div className="scan-form">
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
             <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
               <label>File Path (Context)</label>
               <input 
                 type="text" 
                 className="form-input"
                 value={filePath} 
                 onChange={e => setFilePath(e.target.value)} 
                 placeholder="app/api/route.ts" 
               />
             </div>
             <div className="form-group" style={{ flex: 0.5, marginBottom: 0 }}>
               <label>Artifact Type</label>
               <select 
                 className="form-input"
                 value={artifactKind} 
                 onChange={e => setArtifactKind(e.target.value)}
               >
                 <option value="route">API Route</option>
                 <option value="server_action">React Server Action</option>
                 <option value="sql_schema">Database Schema</option>
               </select>
             </div>
          </div>
          <div className="form-group">
            <label>Raw Source Code</label>
            <textarea 
              className="form-input"
              value={source} 
              onChange={e => setSource(e.target.value)} 
              placeholder="Paste exact code structure here..." 
              rows={8} 
            />
          </div>
          <button 
            className="btn-primary"
            onClick={handleScanSnippet} 
            disabled={loading || !source.trim()}
          >
            {loading ? 'Synthesizing...' : 'Analyze Snippet'}
          </button>
        </div>
      )}

      {findings && (
        <div style={{ marginTop: '2.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Scan Results ({findings.length})</span>
            {scanMetadata && scanMetadata.isWebsite ? (
              <span style={{ fontSize: '0.85rem', color: 'var(--medium-color)', fontFamily: 'Roboto Mono, monospace' }}>
                HTTP Status: {scanMetadata.status}
              </span>
            ) : scanMetadata ? (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Sampled {scanMetadata.scannedCount} of {scanMetadata.totalFiles} files
              </span>
            ) : null}
          </h3>
          
          {findings.length === 0 ? (
            <div style={{ padding: '2rem', background: '#f0fdf4', color: '#166534', borderRadius: '4px', border: '1px solid #bbf7d0' }}>
              <p style={{ fontWeight: '600', margin: 0 }}>✓ Zero vulnerabilities detected in this target environment.</p>
            </div>
          ) : (
            <div className="vuln-list">
              {findings.map((f, i) => (
                <div key={i} className="vuln-item" style={{ flexDirection: 'column', alignItems: 'flex-start', background: 'var(--bg-base)', padding: '1.5rem', borderRadius: '6px', borderLeft: `4px solid var(--${f.severity}-color, var(--text-muted))`, marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '0.75rem' }}>
                    <h4 style={{ margin: 0 }}>{f.title}</h4>
                    <span className={`badge ${f.severity}`}>{f.severity}</span>
                  </div>
                  {f.file_path && (
                    <div style={{ fontFamily: 'Roboto Mono, monospace', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      Target context: {f.file_path}
                    </div>
                  )}
                  <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.95rem', color: 'var(--text-main)' }}>{f.exploit_narrative}</p>
                  
                  <div style={{ width: '100%' }}>
                    <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 'bold' }}>Actionable Evidence (PoC)</div>
                    <div style={{ background: '#0a0a0a', padding: '1.25rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', overflowX: 'auto' }}>
                      <pre style={{ fontSize: '0.85rem', whiteSpace: 'pre-wrap', color: '#e5e7eb', margin: 0, fontFamily: 'Roboto Mono, monospace' }}>
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
