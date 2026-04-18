'use client';

import { useState } from 'react';

export default function LiveScanner() {
  const [source, setSource] = useState('');
  const [filePath, setFilePath] = useState('app/test/route.ts');
  const [artifactKind, setArtifactKind] = useState('route');
  const [loading, setLoading] = useState(false);
  const [findings, setFindings] = useState<any[] | null>(null);

  const handleScan = async () => {
    setLoading(true);
    setFindings(null);
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
    } catch (err) {
      alert('Error: ' + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem' }}>
      <h2 className="section-title">Manual / Live Scan</h2>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input 
          type="text" 
          value={filePath} 
          onChange={e => setFilePath(e.target.value)} 
          placeholder="File Path (e.g. app/api/route.ts)" 
          style={{ flex: 1, padding: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
        />
        <select 
          value={artifactKind} 
          onChange={e => setArtifactKind(e.target.value)}
          style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
        >
          <option value="route">Route</option>
          <option value="server_action">Server Action</option>
          <option value="sql_schema">SQL Schema</option>
        </select>
      </div>
      <textarea 
        value={source} 
        onChange={e => setSource(e.target.value)} 
        placeholder="Paste code snippet here..." 
        rows={10} 
        style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', marginBottom: '1rem', fontFamily: 'monospace' }} 
      />
      <button 
        onClick={handleScan} 
        disabled={loading || !source.trim()}
        style={{ padding: '0.5rem 1rem', background: 'var(--critical-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer' }}
      >
        {loading ? 'Scanning...' : 'Scan Now'}
      </button>

      {findings && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Findings ({findings.length})</h3>
          {findings.length === 0 ? (
            <p>No vulnerabilities found in this snippet!</p>
          ) : (
            <div className="vuln-list" style={{ marginTop: '1rem' }}>
              {findings.map((f, i) => (
                <div key={i} className="vuln-item" style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', marginBottom: '1rem', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4 style={{ margin: 0, color: 'var(--high-color)' }}>{f.title}</h4>
                    <span className={`badge ${f.severity}`}>{f.severity}</span>
                  </div>
                  <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>{f.exploit_narrative}</p>
                  <pre style={{ fontSize: '0.8rem', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', whiteSpace: 'pre-wrap' }}>{f.proof_of_concept}</pre>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
