import React from 'react';
import { NavLink } from 'react-router-dom';
import { authService } from '../services/authService';
import {
  LayoutDashboard,
  UploadCloud,
  FileCheck2,
  Boxes,
  Network,
  AlertOctagon,
  ShieldAlert,
  Server
} from 'lucide-react';

export default function Sidebar() {
  const user = authService.getCurrentUser();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={19} /> },
    { to: '/upload', label: 'Upload Evidence', icon: <UploadCloud size={19} /> },
    { to: '/evidence', label: 'Evidence Vault', icon: <FileCheck2 size={19} /> },
    { to: '/ledger', label: 'Ledger Explorer', icon: <Boxes size={19} /> },
    { to: '/nodes', label: 'Multi-Agency Nodes', icon: <Network size={19} /> },
    { to: '/alerts', label: 'AI Risk Alerts', icon: <AlertOctagon size={19} /> },
  ];

  return (
    <aside className="sidebar">
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '34px',
          height: '34px',
          borderRadius: '8px',
          backgroundColor: 'rgba(56, 189, 248, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-blue)'
        }}>
          <Server size={20} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>EvidenceChain</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--verified-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--verified-green)' }}></span>
            Consensus Online
          </div>
        </div>
      </div>

      <nav style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', padding: '8px 12px', letterSpacing: '0.08em' }}>
          Forensics Navigation
        </div>

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '11px 14px',
              borderRadius: '8px',
              color: isActive ? '#fff' : 'var(--text-muted)',
              backgroundColor: isActive ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
              borderLeft: isActive ? '3px solid var(--accent-blue)' : '3px solid transparent',
              fontWeight: isActive ? 600 : 500,
              fontSize: '0.88rem',
              transition: 'all 0.15s ease'
            })}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Agency Node Card Footer */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)', backgroundColor: 'rgba(11, 15, 25, 0.5)' }}>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '4px' }}>ACTIVE NODE</div>
        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
          {user?.agency || 'Metropolitan Police'}
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          Role: <strong style={{ color: 'var(--accent-blue)' }}>{user?.role}</strong>
        </div>
      </div>
    </aside>
  );
}
