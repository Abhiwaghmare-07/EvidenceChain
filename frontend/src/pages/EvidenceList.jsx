import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { evidenceService } from '../services/evidenceService';
import StatusBadge from '../components/StatusBadge';
import { Search, Filter, FileText, CheckCircle2, ShieldCheck, Download, ExternalLink, RefreshCw } from 'lucide-react';

export default function EvidenceList() {
  const [evidenceList, setEvidenceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [caseFilter, setCaseFilter] = useState('');

  const tags = ['ALL', 'LOG', 'IMAGE', 'EMAIL', 'NETWORK_CAPTURE', 'DOCUMENT'];

  const fetchEvidence = async () => {
    try {
      setLoading(true);
      const data = await evidenceService.list({
        search: searchTerm,
        tag: selectedTag === 'ALL' ? '' : selectedTag,
        caseNumber: caseFilter,
      });
      setEvidenceList(data);
    } catch (err) {
      console.error('Failed to load evidence repository', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvidence();
  }, [selectedTag, caseFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEvidence();
  };

  return (
    <div className="page-body">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            Evidence Vault & Registry
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            Multi-agency searchable repository of hashed and blockchain-anchored digital artifacts.
          </p>
        </div>

        <Link to="/upload" className="btn btn-primary btn-sm">
          + New Evidence Intake
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '24px', padding: '18px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            <input
              type="text"
              className="form-input"
              style={{ width: '100%', paddingLeft: '38px' }}
              placeholder="Search by title, file name, keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ width: '200px' }}>
            <input
              type="text"
              className="form-input"
              style={{ width: '100%' }}
              placeholder="Filter by Case Number..."
              value={caseFilter}
              onChange={(e) => setCaseFilter(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-outline">
            Search
          </button>

          <button
            type="button"
            onClick={() => { setSearchTerm(''); setCaseFilter(''); setSelectedTag('ALL'); }}
            className="btn btn-outline"
            title="Reset Filters"
          >
            <RefreshCw size={14} />
          </button>
        </form>

        {/* Tag Pills */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', marginRight: '4px' }}>
            CATEGORY:
          </span>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`badge ${selectedTag === tag ? 'badge-info' : 'badge-neutral'}`}
              style={{
                cursor: 'pointer',
                border: selectedTag === tag ? '1px solid var(--accent-blue)' : '1px solid var(--border-color)',
                backgroundColor: selectedTag === tag ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                padding: '4px 10px'
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Evidence Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Case Identifier</th>
                <th>Evidence Title</th>
                <th>File Name & Size</th>
                <th>Tags</th>
                <th>Pre-Screening</th>
                <th>Block #</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
                    Loading evidence repository...
                  </td>
                </tr>
              ) : evidenceList.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
                    No matching evidence found. Adjust search filters or upload a new item.
                  </td>
                </tr>
              ) : (
                evidenceList.map((e) => (
                  <tr key={e.id}>
                    <td style={{ fontWeight: 700, color: 'var(--accent-blue)' }}>
                      {e.caseNumber}
                    </td>
                    <td>
                      <Link to={`/evidence/${e.id}`} style={{ fontWeight: 600, color: '#fff' }}>
                        {e.title}
                      </Link>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                        Seized by: {e.investigatorName || e.investigatorId}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{e.fileName}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                        {(e.fileSize / 1024).toFixed(1)} KB
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {(e.autoTags || 'FILE').split(',').slice(0, 2).map((t, idx) => (
                          <span key={idx} className="badge badge-info" style={{ fontSize: '0.62rem' }}>
                            {t.trim()}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span style={{
                        fontWeight: 700,
                        color: e.authenticityScore >= 80 ? 'var(--verified-green)' : 'var(--warning-amber)'
                      }}>
                        {e.authenticityScore} / 100
                      </span>
                    </td>
                    <td style={{ fontFamily: 'JetBrains Mono', fontSize: '0.82rem' }}>
                      #{e.blockIndex}
                    </td>
                    <td>
                      <StatusBadge isTampered={e.tampered} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                        <Link to={`/evidence/${e.id}`} className="btn btn-outline btn-sm">
                          Inspect
                        </Link>
                        <a
                          href={evidenceService.getCertificateUrl(e.id)}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-outline btn-sm"
                          title="View PDF Certificate"
                        >
                          <FileText size={13} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
