import React, { useState, useEffect } from 'react';
import { ledgerService } from '../services/ledgerService';
import { Network, Server, ShieldCheck, ShieldAlert, Cpu, Activity, RefreshCw } from 'lucide-react';

export default function LedgerNodes() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadNodeStats = async () => {
    try {
      setLoading(true);
      const data = await ledgerService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load ledger node stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNodeStats();
  }, []);

  const nodes = [
    {
      id: 'NODE-POLICE-01',
      name: 'Metropolitan Police Cybercrime Node',
      agency: 'State Police Department',
      role: 'PRIMARY_INTAKE (Upload & Evidence Seizure)',
      ip: '10.240.12.55',
      latency: '4ms',
      storageMode: 'H2 File Cluster Engine'
    },
    {
      id: 'NODE-FEDERAL-02',
      name: 'Federal Investigation Agency Node',
      agency: 'National Cyber Security Division',
      role: 'CROSS_JURISDICTION_VALIDATOR (Federal Verify & Transfer)',
      ip: '10.240.18.91',
      latency: '8ms',
      storageMode: 'H2 File Cluster Engine'
    },
    {
      id: 'NODE-JUDICIAL-03',
      name: 'High Court Appellate Registry Node',
      agency: 'State Judiciary Special Cyber Bench',
      role: 'JUDICIAL_SEAL (Read-Only Verification & PDF Certificate Stamp)',
      ip: '10.240.4.12',
      latency: '11ms',
      storageMode: 'H2 File Cluster Engine'
    }
  ];

  return (
    <div className="page-body">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            Multi-Agency Ledger Consensus Nodes
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            Simulated multi-node architecture ensuring Police, Federal, and Judicial courts share a single tamper-evident ledger.
          </p>
        </div>

        <button onClick={loadNodeStats} className="btn btn-outline btn-sm">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Sync Nodes
        </button>
      </div>

      {/* Consensus Summary Banner */}
      <div className="card" style={{
        marginBottom: '28px',
        border: stats?.isValid ? '1px solid var(--verified-green)' : '1px solid var(--tampered-red)',
        background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: stats?.isValid ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: stats?.isValid ? 'var(--verified-green)' : 'var(--tampered-red)'
            }}>
              <Network size={28} />
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                Multi-Agency Consensus Status: {stats?.isValid ? 'SYNCHRONIZED (100%)' : 'DESYNCHRONIZED / BREACH'}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                All 3 statutory authorities are actively validating block height #{stats?.totalBlocks || 0}.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>BLOCK HEIGHT</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-blue)' }}>
                #{stats?.totalBlocks || 0}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>PEER HEALTH</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--verified-green)' }}>
                3 / 3 Online
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Node Cards Grid */}
      <div className="grid-3" style={{ marginBottom: '28px' }}>
        {nodes.map((node, i) => (
          <div key={node.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>{node.id}</span>
                <span className="badge badge-verified" style={{ fontSize: '0.68rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--verified-green)' }}></span>
                  ONLINE
                </span>
              </div>

              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                {node.name}
              </h2>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '16px' }}>
                {node.agency}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem', marginBottom: '16px' }}>
                <div>
                  <div style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>STATUTORY ROLE</div>
                  <div style={{ fontWeight: 600, color: 'var(--accent-blue)' }}>{node.role}</div>
                </div>

                <div>
                  <div style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>LOCAL VALIDATION STATUS</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    {stats?.isValid ? (
                      <span style={{ color: 'var(--verified-green)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldCheck size={14} /> Chain Validated
                      </span>
                    ) : (
                      <span style={{ color: 'var(--tampered-red)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldAlert size={14} /> Tamper Detected
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>NODE INTERNAL IP</div>
                  <div className="font-mono" style={{ color: 'var(--text-muted)' }}>{node.ip}</div>
                </div>
              </div>
            </div>

            <div style={{
              paddingTop: '12px',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              color: 'var(--text-dim)'
            }}>
              <span>Latency: {node.latency}</span>
              <span>Sync: Block #{stats?.totalBlocks || 0}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Technical Explanation Card for Viva Defense */}
      <div className="card" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
          Educational Viva Note: Multi-Agency Decentralized Architecture
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
          In traditional criminal investigations, digital evidence stored in isolated police silos is vulnerable to unilateral modification or suppression.
          EvidenceChain implements a shared cryptographic blockchain ledger where State Police, Federal Investigation Agencies, and Judicial Court registrars
          operate peer consensus nodes. Once an evidence block is minted and stamped with SHA-256 parent block linkages, any unilateral alteration of the file
          or database on one agency node immediately invalidates the entire chain across all partner agency nodes.
        </p>
      </div>
    </div>
  );
}
