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
    <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem' }}>
      <h2 className="section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        On-Demand Scanner
      </h2>
      
      <div className="tabs-container" style={{ flexWrap: 'wrap' }}>
        <button 
          className={`tab-btn ${activeTab === 'website' ? 'active' : ''}`}
          onClick={() => setActiveTab('website')}
        >
          Scan Live Website
        </button>
        <button 
          className={`tab-btn ${activeTab === 'repo' ? 'active' : ''}`}
          onClick={() => setActiveTab('repo')}
        >
          Scan GitHub Repository
        </button>
        <button 
          className={`tab-btn ${activeTab === 'snippet' ? 'active' : ''}`}
          onClick={() => setActiveTab('snippet')}
        >
          Scan Code Snippet
        </button>
      </div>

      {activeTab === 'website' && (
        <div className="scan-form pulse-glow">
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Run a Dynamic Application Security Test (DAST) against any live URL. VibeGuard will analyze HTTP Security Headers, scrape for exposed secrets on the frontend, and investigate unsafe DOM behaviors.
          </p>
          <div className="form-group">
            <label>Live Website URL</label>
            <input 
              type="url" 
              className="form-input"
              value={websiteUrl} 
              onChange={e => setWebsiteUrl(e.target.value)} 
              placeholder="e.g. https://www.example.com" 
            />
          </div>
          <button 
            className="btn-primary"
            onClick={handleScanWebsite} 
            disabled={loading || !websiteUrl.trim()}
          >
            {loading ? 'Performing Dynamic Audit...' : 'Audit Live Website'}
          </button>
        </div>
      )}

      {activeTab === 'repo' && (
        <div className="scan-form">
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Point VibeGuard at any public GitHub repository to perform a spot-check security audit. (Limits to top 3 crucial files to avoid timeouts).
          </p>
          <div className="form-group">
            <label>Repository URL or Owner/Repo</label>
            <input 
              type="text" 
              className="form-input"
              value={repoUrl} 
              onChange={e => setRepoUrl(e.target.value)} 
              placeholder="e.g. https://github.com/mridulsharma/Security- or mridulsharma/Security-" 
            />
          </div>
          <div className="form-group">
            <label>Branch Name</label>
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
            {loading ? 'Analyzing Repository...' : 'Audit Repository'}
          </button>
        </div>
      )}

      {activeTab === 'snippet' && (
        <div className="scan-form">
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
             <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
               <input 
                 type="text" 
                 className="form-input"
                 value={filePath} 
                 onChange={e => setFilePath(e.target.value)} 
                 placeholder="File Path (e.g. app/api/route.ts)" 
               />
             </div>
             <div className="form-group" style={{ marginBottom: 0 }}>
               <select 
                 className="form-input"
                 value={artifactKind} 
                 onChange={e => setArtifactKind(e.target.value)}
                 style={{ minWidth: '150px' }}
               >
                 <option value="route">Route</option>
                 <option value="server_action">Server Action</option>
                 <option value="sql_schema">SQL Schema</option>
               </select>
             </div>
          </div>
          <div className="form-group">
            <textarea 
              className="form-input"
              value={source} 
              onChange={e => setSource(e.target.value)} 
              placeholder="Paste vulnerable or safe code snippet here to test..." 
              rows={8} 
            />
          </div>
          <button 
            className="btn-primary"
            onClick={handleScanSnippet} 
            disabled={loading || !source.trim()}
          >
            {loading ? 'Synthesizing Analysis...' : 'Analyze Snippet'}
          </button>
        </div>
      )}

      {findings && (
        <div style={{ marginTop: '3rem', borderTop: '1px solid var(--panel-border)', paddingTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Audit Findings ({findings.length})</span>
            {scanMetadata && scanMetadata.isWebsite ? (
              <span style={{ fontSize: '0.8rem', color: 'var(--success-color)', fontWeight: 'normal', fontFamily: 'monospace' }}>
                HTTP Status: {scanMetadata.status}
              </span>
            ) : scanMetadata ? (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>
                Sampled {scanMetadata.scannedCount} of {scanMetadata.totalFiles} detected source files
              </span>
            ) : null}
          </h3>
          
          {findings.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem', background: 'rgba(82, 196, 26, 0.05)', borderRadius: '8px', border: '1px solid rgba(82, 196, 26, 0.2)' }}>
              <p style={{ color: 'var(--success-color)', fontWeight: '600' }}>✅ No vulnerabilities found in the audited code/live site!</p>
            </div>
          ) : (
            <div className="vuln-list">
              {findings.map((f, i) => (
                <div key={i} className="vuln-item" style={{ flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0, color: 'var(--high-color)' }}>{f.title}</h4>
                    <span className={`badge ${f.severity}`}>{f.severity}</span>
                  </div>
                  {f.file_path && (
                    <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      Target: {f.file_path}
                    </div>
                  )}
                  <p style={{ margin: '0.5rem 0 1rem 0', fontSize: '0.9rem', color: '#e0e0e0' }}>{f.exploit_narrative}</p>
                  <div style={{ width: '100%', background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,100,100,0.2)' }}>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--critical-color)', marginBottom: '0.5rem', fontWeight: 'bold' }}>Proof of Concept</div>
                    <pre style={{ fontSize: '0.85rem', whiteSpace: 'pre-wrap', color: '#ff8888' }}>{f.proof_of_concept}</pre>
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
