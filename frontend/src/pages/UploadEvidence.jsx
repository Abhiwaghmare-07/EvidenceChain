import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { evidenceService } from '../services/evidenceService';
import { UploadCloud, CheckCircle2, FileText, Shield, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export default function UploadEvidence() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [caseNumber, setCaseNumber] = useState('CASE-2026-CY88');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Central Server Infrastructure, Room 302');
  const [collectionTimestamp, setCollectionTimestamp] = useState(
    new Date(Date.now() - 3600000).toISOString().slice(0, 16)
  );

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleQuickPreset = (presetType) => {
    if (presetType === 'log') {
      const blob = new Blob(["2026-10-18 14:22:01 [CRITICAL] Root privilege escalation exploit payload executed from IP 198.51.100.77. Session terminated.\n2026-10-18 14:22:04 [ALERT] Unauthorized shadow admin created."], { type: 'text/plain' });
      const f = new File([blob], "server_auth_breach.log", { type: 'text/plain' });
      setFile(f);
      setCaseNumber('CASE-2026-CY88');
      setTitle('Server Privilege Escalation Log');
      setDescription('Extracted system security audit log demonstrating unauthorized shadow account creation');
      setLocation('Datacenter Core Node 4, Chicago');
    } else if (presetType === 'email') {
      const blob = new Blob(["From: ceo-wire-transfer@spoofed-domain.com\nTo: finance@victimcorp.com\nSubject: URGENT: Execute Treasury Wire Transfer\nDate: Sun, 18 Oct 2026 12:00:00 +0000\n\nPlease transfer $450,000 immediately to offshore account."], { type: 'message/rfc822' });
      const f = new File([blob], "ceo_spoof_fraud.eml", { type: 'message/rfc822' });
      setFile(f);
      setCaseNumber('CASE-2026-CY42');
      setTitle('Executive Impersonation Phishing Email');
      setDescription('Spear phishing email artifact targeting corporate treasury department');
      setLocation('Corporate Mail Gateway Exchange, New York');
    } else if (presetType === 'pcap') {
      const blob = new Blob(["Wireshark Network Capture TCP Syn Flood and C2 Beaconing to IP 203.0.113.88 port 443"], { type: 'application/vnd.tcpdump.pcap' });
      const f = new File([blob], "c2_beacon_traffic.pcap", { type: 'application/vnd.tcpdump.pcap' });
      setFile(f);
      setCaseNumber('CASE-2026-CY19');
      setTitle('Command & Control Beacon Network Capture');
      setDescription('High-frequency packet dump capturing covert TLS beaconing');
      setLocation('Perimeter Firewall Tap #2, San Jose');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select or drag an evidentiary file to upload.');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('caseNumber', caseNumber);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('collectionTimestamp', new Date(collectionTimestamp).toISOString());

    try {
      const res = await evidenceService.upload(formData);
      setResult(res);
    } catch (err) {
      setError(err.response?.data?.message || 'Evidence upload and blockchain minting failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page-body">
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            Forensic Evidence Intake
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            Compute SHA-256 dual-layer fingerprints, execute heuristic pre-screening, and mint immutable blockchain blocks.
          </p>
        </div>

        {/* Preset Sample Selector for quick demo */}
        <div className="card" style={{ marginBottom: '24px', padding: '16px 20px', backgroundColor: 'rgba(24, 34, 52, 0.7)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
              <Sparkles size={16} color="var(--accent-blue)" />
              Auto-Fill Sample Demo Forensics:
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" onClick={() => handleQuickPreset('log')} className="btn btn-outline btn-sm">
                Server Log (.log)
              </button>
              <button type="button" onClick={() => handleQuickPreset('email')} className="btn btn-outline btn-sm">
                Phishing Email (.eml)
              </button>
              <button type="button" onClick={() => handleQuickPreset('pcap')} className="btn btn-outline btn-sm">
                Traffic Capture (.pcap)
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px',
            borderRadius: '8px',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            marginBottom: '20px',
            fontSize: '0.88rem'
          }}>
            <AlertCircle size={20} />
            <div>{error}</div>
          </div>
        )}

        {/* Success Result Modal / Card */}
        {result ? (
          <div className="card" style={{ border: '2px solid var(--verified-green)', padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--verified-green)'
              }}>
                <CheckCircle2 size={26} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                  Evidence Minted to Blockchain!
                </h2>
                <div style={{ fontSize: '0.82rem', color: 'var(--verified-green)' }}>
                  Block #{result.blockIndex} created with dual-layer integrity fingerprint
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '8px', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>Case Number:</span>
                <span style={{ fontWeight: 700, color: 'var(--accent-blue)' }}>{result.caseNumber}</span>

                <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>Evidence Title:</span>
                <span style={{ fontWeight: 600, color: '#fff' }}>{result.title}</span>

                <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>SHA-256 Hash:</span>
                <span className="hash-pill">{result.fileHash}</span>

                <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>Block Hash:</span>
                <span className="hash-pill">{result.blockHash}</span>

                <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>Authenticity Score:</span>
                <div>
                  <span style={{ fontWeight: 700, color: 'var(--verified-green)' }}>
                    {result.authenticityScore} / 100
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                    ({result.heuristicFlags})
                  </span>
                </div>

                <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>Auto-Tags:</span>
                <span style={{ color: '#fff' }}>{result.autoTags}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => navigate(`/evidence/${result.id}`)}
                className="btn btn-primary"
              >
                View Evidence Detail <ArrowRight size={16} />
              </button>
              <button
                onClick={() => { setResult(null); setFile(null); setTitle(''); }}
                className="btn btn-outline"
              >
                Upload Another Evidence Item
              </button>
            </div>
          </div>
        ) : (
          /* Intake Form */
          <div className="card">
            <form onSubmit={handleSubmit}>
              {/* File Dropzone */}
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Forensic Artifact File *</label>
                <div style={{
                  border: '2px dashed #334155',
                  borderRadius: '10px',
                  padding: '30px',
                  textAlign: 'center',
                  backgroundColor: 'rgba(15, 23, 42, 0.5)',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s'
                }}
                onClick={() => document.getElementById('file-input').click()}
                >
                  <input
                    id="file-input"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <UploadCloud size={38} color="var(--accent-blue)" style={{ margin: '0 auto 10px auto' }} />
                  {file ? (
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>{file.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {(file.size / 1024).toFixed(1)} KB | {file.type || 'Binary Stream'}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>
                        Click to select or drop forensic evidence file
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                        Logs, PCAP dumps, disk images, emails, documents (Stored locally in /storage)
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Case Identifier *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={caseNumber}
                    onChange={(e) => setCaseNumber(e.target.value)}
                    placeholder="e.g. CASE-2026-CY88"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Evidence Title *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Descriptive title of artifact"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Forensic Description & Intake Context</label>
                <textarea
                  rows="3"
                  className="form-textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Notes on seizure circumstances, suspect hardware, or network segment..."
                ></textarea>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Seizure Location / Physical Device *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Physical or cloud location"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Collection Timestamp *</label>
                  <input
                    type="datetime-local"
                    required
                    className="form-input"
                    value={collectionTimestamp}
                    onChange={(e) => setCollectionTimestamp(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="btn btn-primary"
                  style={{ minWidth: '170px' }}
                >
                  <Shield size={16} />
                  {uploading ? 'Hashing & Minting...' : 'Hash & Mint to Ledger'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
