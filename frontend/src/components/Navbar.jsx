import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { alertService } from '../services/alertService';
import { Shield, User, LogOut, ExternalLink, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [simulating, setSimulating] = useState(false);
  const [attackMsg, setAttackMsg] = useState(null);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleSimulateAttack = async () => {
    if (!window.confirm("Trigger AI anomaly attack simulation? This will simulate rapid exfiltration on 'officer_chen' and lock the account.")) {
      return;
    }
    try {
      setSimulating(true);
      const res = await alertService.simulateAttack('officer_chen');
      setAttackMsg(`Attack simulated! Officer Chen locked with Risk Score ${res.riskScore}/100`);
      setTimeout(() => setAttackMsg(null), 6000);
    } catch (err) {
      alert("Failed to simulate attack: " + (err.response?.data?.message || err.message));
    } finally {
      setSimulating(false);
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'POLICE': return 'badge-info';
      case 'FEDERAL': return 'badge-warning';
      case 'JUDGE': return 'badge-verified';
      case 'ADMIN': return 'badge-tampered';
      default: return 'badge-neutral';
    }
  };

  return (
    <header style={{
      height: '70px',
      backgroundColor: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 30px',
      position: 'sticky',
      top: 0,
      zIndex: 30
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Shield size={26} color="var(--accent-blue)" />
        <div>
          <span style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em', color: '#fff' }}>
            Evidence<span style={{ color: 'var(--accent-blue)' }}>Chain</span>
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginLeft: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Cybercrime Forensics Ledger
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        {attackMsg && (
          <div style={{
            fontSize: '0.82rem',
            padding: '6px 14px',
            borderRadius: '6px',
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            color: '#f87171',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <AlertTriangle size={15} />
            {attackMsg}
          </div>
        )}

        {user?.role === 'ADMIN' && (
          <button
            onClick={handleSimulateAttack}
            disabled={simulating}
            className="btn btn-sm btn-danger"
            title="ADMIN DEMO: Injects rapid exfiltration activity to trip AI Anomaly Lockout"
          >
            <Zap size={14} />
            {simulating ? 'Simulating...' : 'Simulate Attack'}
          </button>
        )}

        <a
          href="/admin/login"
          target="_blank"
          rel="noreferrer"
          className="btn btn-sm btn-outline"
          title="Open JSP/Servlet Admin Portal"
          style={{ fontSize: '0.8rem' }}
        >
          <ExternalLink size={14} />
          JSP Admin Portal
        </a>

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '1px solid var(--border-color)', paddingLeft: '18px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{user.fullName || user.username}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                <span className={`badge ${getRoleBadgeClass(user.role)}`} style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                  {user.role}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                  {user.agency || 'Cyber Agency'}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="btn btn-sm btn-outline"
              style={{ padding: '8px', color: 'var(--text-muted)' }}
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
