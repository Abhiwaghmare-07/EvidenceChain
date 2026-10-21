import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { evidenceService } from '../services/evidenceService';
import { authService } from '../services/authService';
import StatusBadge from '../components/StatusBadge';
import {
  ShieldCheck,
  ShieldAlert,
  FileCheck2,
  Download,
  FileText,
  UserCheck,
  Zap,
  Clock,
  MapPin,
  Tag,
  Copy,
  Check,
  AlertTriangle,
  ArrowLeft,
  Share2,
  RefreshCw,
  Eye,
  Sparkles
} from 'lucide-react';

export default function EvidenceDetail() {
  const { id } = useParams();
  const currentUser = authService.getCurrentUser();

  const [evidence, setEvidence] = useState(null);
  const [custodyLogs, setCustodyLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const [tampering, setTampering] = useState(false);

  // Transfer Modal State
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferTarget, setTransferTarget] = useState('agent_miller');
  const [transferNote, setTransferNote] = useState('Transferred for federal cyber forensic verification');
  const [transferring, setTransferring] = useState(false);

  // Phase 8 Text Analysis Modals State
  const [showRedactedModal, setShowRedactedModal] = useState(false);
  const [redactedData, setRedactedData] = useState(null);
  const [loadingRedacted, setLoadingRedacted] = useState(false);

  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const [copiedHash, setCopiedHash] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [evidenceData, logsData] = await Promise.all([
        evidenceService.getById(id),
        evidenceService.getCustodyLogs(id)
      ]);
      setEvidence(evidenceData);
      setCustodyLogs(logsData);
    } catch (err) {
      console.error('Failed to load evidence detail', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleVerify = async () => {
    try {
      setVerifying(true);
      const res = await evidenceService.verify(id);
      setVerifyResult(res);
      // Reload logs to reflect new VERIFY entry
      const updatedLogs = await evidenceService.getCustodyLogs(id);
      setCustodyLogs(updatedLogs);
      const updatedEvidence = await evidenceService.getById(id);
      setEvidence(updatedEvidence);
    } catch (err) {
      alert('Verification failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setVerifying(false);
    }
  };

  const handleSimulateTamper = async () => {
    if (!window.confirm("ADMIN DEMO: Invert physical byte of stored file on disk? This will immediately cause cryptographic verification to FAIL.")) {
      return;
    }
    try {
      setTampering(true);
      await evidenceService.simulateTamper(id);
      await handleVerify(); // Immediately re-verify to show live TAMPERED alert
    } catch (err) {
      alert('Tamper simulation failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setTampering(false);
    }
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    try {
      setTransferring(true);
      await evidenceService.transfer(id, transferTarget, transferNote);
      setShowTransferModal(false);
      await loadData();
    } catch (err) {
      alert('Custody transfer failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setTransferring(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleViewRedacted = async () => {
    try {
      setLoadingRedacted(true);
      setShowRedactedModal(true);
      const data = await evidenceService.getRedacted(id);
      setRedactedData(data);
    } catch (err) {
      alert('Could not generate redacted view: ' + (err.response?.data?.error || err.message));
      setShowRedactedModal(false);
    } finally {
      setLoadingRedacted(false);
    }
  };

  const handleViewSummary = async () => {
    try {
      setLoadingSummary(true);
      setShowSummaryModal(true);
      const data = await evidenceService.getSummary(id);
      setSummaryData(data);
    } catch (err) {
      alert('Could not generate forensic summary: ' + (err.response?.data?.error || err.message));
      setShowSummaryModal(false);
    } finally {
      setLoadingSummary(false);
    }
  };

  if (loading) {
    return (
      <div className="page-body" style={{ textAlign: 'center', padding: '60px' }}>
        <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 12px auto' }} />
        <p style={{ color: 'var(--text-muted)' }}>Retrieving cryptographic custody record #{id}...</p>
      </div>
    );
  }

  if (!evidence) {
    return (
      <div className="page-body">
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <AlertTriangle size={32} color="var(--tampered-red)" style={{ margin: '0 auto 12px auto' }} />
          <h2>Evidence Record Not Found</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>The specified evidence identifier #{id} does not exist.</p>
          <Link to="/evidence" className="btn btn-outline" style={{ marginTop: '20px' }}>
            <ArrowLeft size={16} /> Back to Evidence Vault
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-body">
      {/* Top Breadcrumb & Action Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/evidence" className="btn btn-outline btn-sm">
            <ArrowLeft size={14} /> Back
          </Link>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fff' }}>
                {evidence.title}
              </h1>
              <StatusBadge isTampered={evidence.tampered} />
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              Case Ref: <strong style={{ color: 'var(--accent-blue)' }}>{evidence.caseNumber}</strong> | ID: #{evidence.id} | Block #{evidence.blockIndex}
            </div>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={handleVerify}
            disabled={verifying}
            className="btn btn-success btn-sm"
            title="Re-compute file hash and compare against immutable block on ledger"
          >
            <ShieldCheck size={16} />
            {verifying ? 'Validating...' : 'Verify Integrity'}
          </button>

          <a
            href={evidenceService.getCertificateUrl(evidence.id)}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline btn-sm"
            title="Generate OpenPDF Judicial Forensic Certificate"
          >
            <FileText size={15} />
            Integrity Certificate PDF
          </a>

          <a
            href={evidenceService.getDownloadUrl(evidence.id)}
            className="btn btn-outline btn-sm"
            title="Download raw forensic artifact"
          >
            <Download size={15} />
            Raw File
          </a>

          <button
            onClick={handleViewRedacted}
            className="btn btn-outline btn-sm"
            title="Privacy Preservation: View PII-masked version (Emails, Phones, IDs masked; original hash untouched)"
          >
            <Eye size={15} />
            Redacted Copy
          </button>

          <button
            onClick={handleViewSummary}
            className="btn btn-outline btn-sm"
            title="AI Artifact Intelligence: View Smart Forensic Summary (IPs, Emails, Timestamps, Keywords)"
          >
            <Sparkles size={15} />
            Smart Summary
          </button>

          <button
            onClick={() => setShowTransferModal(true)}
            className="btn btn-outline btn-sm"
          >
            <Share2 size={15} />
            Transfer Custody
          </button>

          {currentUser?.role === 'ADMIN' && (
            <button
              onClick={handleSimulateTamper}
              disabled={tampering}
              className="btn btn-danger btn-sm"
              title="ADMIN DEMO: Injects physical 1-byte file corruption on disk"
            >
              <Zap size={14} />
              {tampering ? 'Tampering...' : 'Simulate Tamper'}
            </button>
          )}
        </div>
      </div>

      {/* Live Verification Result Banner (if run) */}
      {verifyResult && (
        <div style={{
          padding: '16px 20px',
          borderRadius: '10px',
          backgroundColor: verifyResult.verified ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: verifyResult.verified ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '14px'
        }}>
          {verifyResult.verified ? (
            <ShieldCheck size={28} color="var(--verified-green)" style={{ flexShrink: 0 }} />
          ) : (
            <ShieldAlert size={28} color="var(--tampered-red)" style={{ flexShrink: 0 }} />
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '0.98rem', color: verifyResult.verified ? 'var(--verified-green)' : '#f87171' }}>
              {verifyResult.verified ? 'VERIFICATION PASSED: Cryptographic Match Confirmed' : 'TAMPER DETECTED: Cryptographic Hash Mismatch!'}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#e2e8f0', marginTop: '4px' }}>
              {verifyResult.details}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '6px' }}>
              Ledger Expected: <code className="font-mono">{verifyResult.expectedHash}</code> | Computed File: <code className="font-mono">{verifyResult.actualHash}</code>
            </div>
          </div>
        </div>
      )}

      {/* Dual Layout: Metadata & Blockchain Proofs on Left, Custody Timeline on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.4fr', gap: '24px' }}>
        {/* Left Column: Artifact Details & Dual-Layer Fingerprint */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Evidentiary Metadata Card */}
          <div className="card">
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', color: '#fff' }}>
              Evidentiary Metadata
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px', fontSize: '0.88rem' }}>
              <span style={{ color: 'var(--text-dim)' }}>File Name:</span>
              <span style={{ fontWeight: 600, color: '#fff' }}>{evidence.fileName}</span>

              <span style={{ color: 'var(--text-dim)' }}>File Type:</span>
              <span>{evidence.fileType}</span>

              <span style={{ color: 'var(--text-dim)' }}>File Size:</span>
              <span>{(evidence.fileSize / 1024).toFixed(2)} KB ({evidence.fileSize} bytes)</span>

              <span style={{ color: 'var(--text-dim)' }}>Seizure Location:</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} color="var(--accent-blue)" /> {evidence.location}
              </span>

              <span style={{ color: 'var(--text-dim)' }}>Collection Date:</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} color="var(--text-muted)" />
                {new Date(evidence.collectionTimestamp).toLocaleString()}
              </span>

              <span style={{ color: 'var(--text-dim)' }}>Current Custodian:</span>
              <span style={{ fontWeight: 600, color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <UserCheck size={14} /> {evidence.currentOwnerName || 'Investigating Officer'}
              </span>

              <span style={{ color: 'var(--text-dim)' }}>Classification Tags:</span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {(evidence.autoTags || 'NONE').split(',').map((t, i) => (
                  <span key={i} className="badge badge-info" style={{ fontSize: '0.65rem' }}>
                    {t.trim()}
                  </span>
                ))}
              </div>

              {evidence.description && (
                <>
                  <span style={{ color: 'var(--text-dim)' }}>Description:</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{evidence.description}</span>
                </>
              )}
            </div>
          </div>

          {/* Cryptographic Dual-Layer Fingerprint Card */}
          <div className="card" style={{ border: '1px solid #3b82f6', background: 'linear-gradient(180deg, rgba(30, 58, 138, 0.15) 0%, var(--bg-card) 100%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <ShieldCheck size={20} color="var(--accent-blue)" />
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>
                Dual-Layer Cryptographic Fingerprint
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Layer 1: SHA-256 Digest */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Layer 1: SHA-256 File Digest
                  </span>
                  <button
                    onClick={() => copyToClipboard(evidence.fileHash)}
                    className="btn btn-outline btn-sm"
                    style={{ padding: '2px 8px', fontSize: '0.72rem' }}
                  >
                    {copiedHash ? <Check size={12} color="var(--verified-green)" /> : <Copy size={12} />}
                    {copiedHash ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="hash-pill" style={{ padding: '8px 12px' }}>
                  {evidence.fileHash}
                </div>
              </div>

              {/* Layer 2: Heuristic Authenticity Pre-Screening */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Layer 2: Heuristic Pre-Screening Score
                  </span>
                  <span style={{
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    color: evidence.authenticityScore >= 80 ? 'var(--verified-green)' : 'var(--warning-amber)'
                  }}>
                    {evidence.authenticityScore} / 100
                  </span>
                </div>

                {/* Score bar */}
                <div style={{ width: '100%', height: '8px', backgroundColor: '#0f172a', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${evidence.authenticityScore}%`,
                    height: '100%',
                    backgroundColor: evidence.authenticityScore >= 80 ? 'var(--verified-green)' : 'var(--warning-amber)',
                    borderRadius: '4px'
                  }}></div>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '8px' }}>
                  <strong>Pre-Screening Flags:</strong> {evidence.heuristicFlags || 'Verified consistent header signatures'}
                </div>
              </div>

              {/* Blockchain Anchoring Info */}
              <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-dim)' }}>Ledger Position:</span>
                <span style={{ fontWeight: 700, color: '#c084fc' }}>Block #{evidence.blockIndex}</span>

                <span style={{ color: 'var(--text-dim)' }}>Block Hash:</span>
                <span className="hash-pill">{evidence.blockHash}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Custody Timeline */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>
                Chain of Custody Audit Trail
              </h2>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                Immutable historical event log (ISO/IEC 27037)
              </div>
            </div>
            <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
              {custodyLogs.length} Events
            </span>
          </div>

          <div className="timeline">
            {custodyLogs.map((log) => {
              let dotColor = 'var(--accent-blue)';
              if (log.action === 'VERIFY') dotColor = 'var(--verified-green)';
              if (log.action === 'TAMPER_SIMULATION') dotColor = 'var(--tampered-red)';
              if (log.action === 'TRANSFER') dotColor = 'var(--warning-amber)';

              return (
                <div key={log.id} className="timeline-item">
                  <span className="timeline-dot" style={{ backgroundColor: dotColor }}></span>
                  <div style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span className="badge badge-info" style={{
                        fontSize: '0.65rem',
                        backgroundColor: log.action === 'VERIFY' ? 'var(--verified-green-bg)' : log.action === 'TAMPER_SIMULATION' ? 'var(--tampered-red-bg)' : 'rgba(56, 189, 248, 0.12)',
                        color: log.action === 'VERIFY' ? 'var(--verified-green)' : log.action === 'TAMPER_SIMULATION' ? 'var(--tampered-red)' : 'var(--accent-blue)'
                      }}>
                        {log.action}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
                      {log.username} <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 400 }}>({log.userRole})</span>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {log.details}
                    </div>

                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '6px' }}>
                      Node IP: {log.ipAddress || '127.0.0.1'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Transfer Custody Modal */}
      {showTransferModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '20px'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '28px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px', color: '#fff' }}>
              Transfer Evidence Custody
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
              Transfer legal handling of artifact #{evidence.id} to another accredited investigator.
            </p>

            <form onSubmit={handleTransferSubmit}>
              <div className="form-group">
                <label className="form-label">Receiving Officer / Agent *</label>
                <select
                  className="form-select"
                  value={transferTarget}
                  onChange={(e) => setTransferTarget(e.target.value)}
                >
                  <option value="agent_miller">Special Agent Sarah Miller (FEDERAL - FIA)</option>
                  <option value="officer_chen">Inspector David Chen (POLICE - Cybercrime)</option>
                  <option value="judge_vance">Hon. Judge Raymond Vance (JUDGE - Judiciary)</option>
                  <option value="admin">System Administrator (ADMIN - HQ)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Transfer Justification / Chain-of-Custody Note *</label>
                <textarea
                  rows="3"
                  required
                  className="form-textarea"
                  value={transferNote}
                  onChange={(e) => setTransferNote(e.target.value)}
                  placeholder="State judicial purpose, forensic lab dispatch, or courtroom presentation..."
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={transferring}
                  className="btn btn-primary"
                >
                  {transferring ? 'Transferring...' : 'Execute Custody Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PII Redacted Preview Modal */}
      {showRedactedModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '720px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Eye size={18} color="var(--accent-blue)" /> PII Auto-Redacted Forensic View
                </h2>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Masks personal identifiable information (emails, phone numbers, SSNs, credit cards) for public/judicial filing.
                </div>
              </div>
              <button onClick={() => setShowRedactedModal(false)} className="btn btn-outline btn-sm">Close</button>
            </div>

            <div style={{ padding: '10px 14px', borderRadius: '6px', backgroundColor: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.25)', marginBottom: '14px', fontSize: '0.8rem' }}>
              <strong style={{ color: 'var(--accent-blue)' }}>Cryptographic Assurance:</strong> The raw file and its immutable SHA-256 hash (<code className="font-mono">{redactedData?.originalHashUntouched?.substring(0, 16)}...</code>) remain 100% unaltered on the blockchain. Redaction is applied on-the-fly for privacy preservation.
            </div>

            <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#090d16', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              {loadingRedacted ? (
                <div style={{ textAlign: 'center', padding: '30px' }}>
                  <RefreshCw size={22} className="animate-spin" style={{ margin: '0 auto 8px auto' }} />
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Sanitizing PII patterns...</p>
                </div>
              ) : (
                <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.82rem', color: '#e2e8f0', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                  {redactedData?.redactedContent || 'No text content available.'}
                </pre>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button onClick={() => setShowRedactedModal(false)} className="btn btn-primary btn-sm">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Smart Forensic Summary Modal */}
      {showSummaryModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '700px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} color="#c084fc" /> Smart Forensic Artifact Summary
                </h2>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Automated entity extraction and intelligence summary (pure Java regex & keyword frequencies).
                </div>
              </div>
              <button onClick={() => setShowSummaryModal(false)} className="btn btn-outline btn-sm">Close</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {loadingSummary ? (
                <div style={{ textAlign: 'center', padding: '30px' }}>
                  <RefreshCw size={22} className="animate-spin" style={{ margin: '0 auto 8px auto' }} />
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Extracting entities and keywords...</p>
                </div>
              ) : (
                <>
                  {/* Extracted Network IPs */}
                  <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Identified Network IP Addresses ({summaryData?.summary?.extractedIps?.length || 0})
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {summaryData?.summary?.extractedIps?.length > 0 ? (
                        summaryData.summary.extractedIps.map((ip, i) => (
                          <span key={i} className="badge" style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontFamily: 'monospace', fontSize: '0.78rem' }}>
                            {ip}
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>No IP addresses detected</span>
                      )}
                    </div>
                  </div>

                  {/* Extracted Emails */}
                  <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Identified Email Accounts ({summaryData?.summary?.extractedEmails?.length || 0})
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {summaryData?.summary?.extractedEmails?.length > 0 ? (
                        summaryData.summary.extractedEmails.map((em, i) => (
                          <span key={i} className="badge" style={{ backgroundColor: 'rgba(52, 211, 153, 0.15)', color: '#34d399', fontFamily: 'monospace', fontSize: '0.78rem' }}>
                            {em}
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>No email addresses detected</span>
                      )}
                    </div>
                  </div>

                  {/* Extracted Timestamps */}
                  <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Chronological Event Timestamps ({summaryData?.summary?.extractedTimestamps?.length || 0})
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {summaryData?.summary?.extractedTimestamps?.length > 0 ? (
                        summaryData.summary.extractedTimestamps.map((ts, i) => (
                          <span key={i} className="badge" style={{ backgroundColor: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                            {ts}
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>No formatted timestamps detected</span>
                      )}
                    </div>
                  </div>

                  {/* Top Forensic Keywords */}
                  <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#c084fc', textTransform: 'uppercase', marginBottom: '8px' }}>
                      High-Frequency Forensic Keywords
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {summaryData?.summary?.topKeywords?.length > 0 ? (
                        summaryData.summary.topKeywords.map((kw, i) => (
                          <span key={i} className="badge" style={{ backgroundColor: 'rgba(192, 132, 252, 0.15)', color: '#c084fc', fontSize: '0.78rem' }}>
                            {kw}
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>No prominent keywords</span>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button onClick={() => setShowSummaryModal(false)} className="btn btn-primary btn-sm">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
