import React, { useState, useEffect } from 'react';
import { ledgerService } from '../services/ledgerService';
import { Boxes, ShieldCheck, ShieldAlert, RefreshCw, Link2, Hash, Clock, User, CheckCircle2 } from 'lucide-react';

export default function LedgerExplorer() {
  const [blocks, setBlocks] = useState([]);
  const [validation, setValidation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);

  const loadLedger = async () => {
    try {
      setLoading(true);
      const [blocksData, validationData] = await Promise.all([
        ledgerService.getBlocks(),
        ledgerService.validateChain()
      ]);
      setBlocks(blocksData);
      setValidation(validationData);
    } catch (err) {
      console.error('Failed to load blockchain ledger', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLedger();
  }, []);

  const handleValidateNow = async () => {
    try {
      setValidating(true);
      const result = await ledgerService.validateChain();
      setValidation(result);
    } catch (err) {
      alert('Validation error: ' + (err.response?.data?.message || err.message));
    } finally {
      setValidating(false);
    }
  };

  return (
    <div className="page-body">
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            Blockchain Ledger Explorer
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            Transparent cryptographic audit chain linking all forensic evidence blocks via SHA-256 parent hashes.
          </p>
        </div>

        <button
          onClick={handleValidateNow}
          disabled={validating}
          className="btn btn-outline btn-sm"
        >
          <RefreshCw size={14} className={validating ? 'animate-spin' : ''} />
          {validating ? 'Validating Nodes...' : 'Re-Validate Entire Chain'}
        </button>
      </div>

      {/* Global Chain Integrity Status Banner */}
      {validation && (
        <div style={{
          padding: '20px 24px',
          borderRadius: '12px',
          backgroundColor: validation.valid ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
          border: validation.valid ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(239, 68, 68, 0.35)',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {validation.valid ? (
              <ShieldCheck size={38} color="var(--verified-green)" />
            ) : (
              <ShieldAlert size={38} color="var(--tampered-red)" />
            )}
            <div>
              <div style={{
                fontSize: '1.15rem',
                fontWeight: 800,
                color: validation.valid ? 'var(--verified-green)' : '#f87171'
              }}>
                {validation.valid ? 'BLOCKCHAIN STATUS: 100% INTACT & VERIFIED' : 'CRITICAL LEDGER COMPROMISE DETECTED'}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '4px' }}>
                {validation.reason}
              </div>
              {validation.brokenBlockIndex != null && (
                <div style={{ fontSize: '0.8rem', color: '#fca5a5', marginTop: '4px', fontWeight: 700 }}>
                  Broken Link Point: Block #{validation.brokenBlockIndex}
                </div>
              )}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>TOTAL BLOCKS PERSISTED</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>{validation.totalBlocks}</div>
          </div>
        </div>
      )}

      {/* Visual Chain Progression Stream */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-dim)' }}>
            <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 10px auto' }} />
            Loading cryptographic blocks...
          </div>
        ) : (
          blocks.map((block, idx) => {
            const isGenesis = block.blockIndex === 0;
            return (
              <div key={block.blockIndex} className="card" style={{
                border: isGenesis ? '1px solid #6366f1' : '1px solid var(--border-color)',
                backgroundColor: isGenesis ? 'rgba(30, 27, 75, 0.4)' : 'var(--bg-card)'
              }}>
                {/* Block Header Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      backgroundColor: isGenesis ? '#4f46e5' : '#2563eb',
                      color: '#fff',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: '6px'
                    }}>
                      {isGenesis ? 'GENESIS BLOCK #0' : `BLOCK #${block.blockIndex}`}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Minted: {new Date(block.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>
                      Evidence ID: {block.evidenceId ? `#${block.evidenceId}` : 'None (Genesis)'}
                    </span>
                    <span className="badge badge-verified" style={{ fontSize: '0.68rem' }}>
                      Authenticity: {block.authenticityScore}/100
                    </span>
                  </div>
                </div>

                {/* Hashes Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '10px', fontSize: '0.82rem' }}>
                  <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>Block Header Hash:</span>
                  <div className="hash-pill" style={{ color: '#38bdf8' }}>{block.blockHash}</div>

                  <span style={{ color: 'var(--text-dim)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Link2 size={13} /> Previous Hash:
                  </span>
                  <div className="hash-pill" style={{ color: '#94a3b8' }}>{block.previousHash}</div>

                  <span style={{ color: 'var(--text-dim)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Hash size={13} /> Evidence File Hash:
                  </span>
                  <div className="hash-pill" style={{ color: '#a78bfa' }}>{block.fileHash}</div>

                  <span style={{ color: 'var(--text-dim)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={13} /> Minting Authority:
                  </span>
                  <span style={{ color: '#fff', fontWeight: 500 }}>{block.investigatorId}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
