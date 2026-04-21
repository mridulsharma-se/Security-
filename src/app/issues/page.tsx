'use client';

import { createClient } from '@/lib/supabase/server';
import { useEffect, useState } from 'react';

export default function IssuesPage() {
  const [vulnerabilities, setVulnerabilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeverity, setSelectedSeverity] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = '/login';
        return;
      }

      const { data } = await supabase
        .from('vulnerabilities')
        .select('*, repositories(full_name)')
        .order('created_at', { ascending: false })
        .limit(200);

      setVulnerabilities(data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const toggleSeverity = (severity: string) => {
    setSelectedSeverity(prev =>
      prev.includes(severity)
        ? prev.filter(s => s !== severity)
        : [...prev, severity]
    );
  };

  const toggleStatus = (status: string) => {
    setSelectedStatus(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const filteredVulns = vulnerabilities.filter(v => {
    const matchesSeverity = selectedSeverity.length === 0 || selectedSeverity.includes(v.severity);
    const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(v.status);
    const matchesSearch = v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (v.file_path?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    return matchesSeverity && matchesStatus && matchesSearch;
  });

  const severityOptions = [
    { label: 'Critical', value: 'critical', color: 'critical' },
    { label: 'High', value: 'high', color: 'high' },
    { label: 'Medium', value: 'medium', color: 'medium' },
    { label: 'Low', value: 'low', color: 'low' },
  ];

  const statusOptions = [
    { label: 'Open', value: 'open' },
    { label: 'In Progress', value: 'pr_open' },
    { label: 'Fixed', value: 'merged' },
    { label: 'Ignored', value: 'ignored' },
  ];

  return (
    <div className="dashboard-container">
      <header className="page-header">
        <h1>Vulnerability Ledger</h1>
        <p>Comprehensive tracking and management of all detected security issues across your repositories.</p>
      </header>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-group" style={{ flex: 1, minWidth: '250px' }}>
          <input
            type="text"
            className="search-input"
            placeholder="Search vulnerabilities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <div className="filter-group">
          <div className="filter-label">Severity</div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {severityOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => toggleSeverity(opt.value)}
                className={`chip ${selectedSeverity.includes(opt.value) ? '' : ''}`}
                style={{
                  background: selectedSeverity.includes(opt.value)
                    ? `var(--${opt.color}-bg)`
                    : 'var(--bg-hover)',
                  color: selectedSeverity.includes(opt.value)
                    ? `var(--${opt.color}-color)`
                    : 'var(--text-muted)',
                  cursor: 'pointer',
                  border: selectedSeverity.includes(opt.value)
                    ? `1px solid var(--${opt.color}-border)`
                    : '1px solid var(--border-subtle)',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <div className="filter-label">Status</div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {statusOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => toggleStatus(opt.value)}
                className="chip"
                style={{
                  background: selectedStatus.includes(opt.value)
                    ? 'var(--accent-dim)'
                    : 'var(--bg-hover)',
                  color: selectedStatus.includes(opt.value)
                    ? 'var(--accent-primary)'
                    : 'var(--text-muted)',
                  cursor: 'pointer',
                  border: selectedStatus.includes(opt.value)
                    ? '1px solid var(--accent-primary)'
                    : '1px solid var(--border-subtle)',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        Showing <strong style={{ color: 'var(--text-main)' }}>{filteredVulns.length}</strong> of <strong style={{ color: 'var(--text-main)' }}>{vulnerabilities.length}</strong> vulnerabilities
      </div>

      {/* Data Table */}
      <section className="surface-panel">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <div className="spinner" style={{ display: 'inline-block', marginBottom: '1rem' }}></div>
            <p>Loading vulnerabilities...</p>
          </div>
        ) : !vulnerabilities || vulnerabilities.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="40" height="40" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div className="empty-state-title">No Vulnerabilities</div>
            <div className="empty-state-description">Your repositories are secure! Keep them that way by running regular scans.</div>
          </div>
        ) : filteredVulns.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="40" height="40" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5 1h-8C6.12 1 5 2.12 5 3.5v17C5 21.88 6.12 23 7.5 23h8c1.38 0 2.5-1.12 2.5-2.5v-17C18 2.12 16.88 1 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h8v14z"/>
              </svg>
            </div>
            <div className="empty-state-title">No Matching Results</div>
            <div className="empty-state-description">Try adjusting your filters or search terms.</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Severity</th>
                  <th>Title & Location</th>
                  <th style={{ width: '200px' }}>Repository</th>
                  <th style={{ width: '120px' }}>Status</th>
                  <th style={{ width: '140px' }}>Detected</th>
                </tr>
              </thead>
              <tbody>
                {filteredVulns.map((vuln) => (
                  <tr key={vuln.id}>
                    <td>
                      <span className={`badge ${vuln.severity}`}>{vuln.severity}</span>
                    </td>
                    <td>
                      <div style={{ color: 'var(--text-main)', fontWeight: '500' }}>{vuln.title}</div>
                      {vuln.file_path && (
                        <div className="table-cell-mono">
                          {vuln.file_path}:{vuln.line_start}
                        </div>
                      )}
                    </td>
                    <td>
                      <span style={{ color: 'var(--accent-primary)', fontWeight: '500' }}>
                        {(Array.isArray(vuln.repositories) ? vuln.repositories[0]?.full_name : (vuln.repositories as any)?.full_name) || 'Manual Audit'}
                      </span>
                    </td>
                    <td>
                      {vuln.status === 'pr_open' ? (
                        <a href={vuln.pr_url || '#'} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                          <span className="status-badge progress">
                            <span className="status-dot progress"></span>
                            PR Open
                          </span>
                        </a>
                      ) : vuln.status === 'merged' ? (
                        <span className="status-badge fixed">
                          <span className="status-dot fixed"></span>
                          Fixed
                        </span>
                      ) : vuln.status === 'ignored' ? (
                        <span className="status-badge ignored">
                          <span className="status-dot ignored"></span>
                          Ignored
                        </span>
                      ) : (
                        <span className="status-badge open">
                          <span className="status-dot open"></span>
                          Open
                        </span>
                      )}
                    </td>
                    <td className="table-cell-mono" suppressHydrationWarning>
                      {new Date(vuln.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
