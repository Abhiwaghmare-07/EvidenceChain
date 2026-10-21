import React, { useState, useEffect } from 'react';
import { alertService } from '../services/alertService';
import { authService } from '../services/authService';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Lock,
  Unlock,
  RefreshCw,
  Zap,
  Activity,
  UserCheck
} from 'lucide-react';

export default function Alerts() {
  const currentUser = authService.getCurrentUser();
  const [alerts, setAlerts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);

  const loadAlertsData = async () => {
    try {
      setLoading(true);
      const alertsData = await alertService.getAlerts();
      setAlerts(alertsData);

      if (currentUser?.role === 'ADMIN') {
        const usersData = await alertService.getUsers();
        setUsers(usersData);
      }
    } catch (err) {
      console.error('Failed to load security alerts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlertsData();
  }, []);

  const handleResolve = async (id) => {
    try {
      await alertService.resolveAlert(id);
      await loadAlertsData();
    } catch (err) {
      alert('Failed to resolve alert: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleUnlockUser = async (userId) => {
    try {
      await alertService.unlockUser(userId);
      alert('Officer account successfully unlocked and cleared.');
      await loadAlertsData();
    } catch (err) {
      alert('Failed to unlock user: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleLockUser = async (userId) => {
    try {
      await alertService.lockUser(userId);
      alert('Officer account has been administratively locked.');
      await loadAlertsData();
    } catch (err) {
      alert('Failed to lock user: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSimulateAttack = async (username) => {
    try {
      setSimulating(true);
      const res = await alertService.simulateAttack(username);
      alert(`Simulation Triggered: ${res.message} Target locked with Risk Score ${res.riskScore}/100.`);
      await loadAlertsData();
    } catch (err) {
      alert('Attack simulation failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="page-body">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            AI Anomaly & Risk Alerts
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            Continuous behavioral z-score heuristics and automated statutory lockout enforcement.
          </p>
        </div>

        <button onClick={loadAlertsData} className="btn btn-outline btn-sm">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Admin Demo Simulation Card */}
      {currentUser?.role === 'ADMIN' && (
        <div className="card" style={{ marginBottom: '24px', border: '1px solid #dc2626', backgroundColor: 'rgba(220, 38, 38, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', fontWeight: 700 }}>
                <Zap size={18} />
                ADMIN TEST HARNESS: Simulate Insider Exfiltration Attack
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Simulates 6 rapid evidence downloads and 3 failed cryptographic checks to trigger the AI behavioral lockout.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleSimulateAttack('officer_chen')}
                disabled={simulating}
                className="btn btn-danger btn-sm"
              >
                Attack Officer Chen
              </button>
              <button
                onClick={() => handleSimulateAttack('agent_miller')}
                disabled={simulating}
                className="btn btn-danger btn-sm"
              >
                Attack Agent Miller
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Locked Users Section */}
      {currentUser?.role === 'ADMIN' && users.length > 0 && (
        <div className="card" style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck size={18} color="var(--accent-blue)" />
            Account Security & Lockout Management
          </h2>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Officer / User</th>
                  <th>Role</th>
                  <th>Agency</th>
                  <th>Account Status</th>
                  <th style={{ textAlign: 'right' }}>Security Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{u.fullName}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>@{u.username}</div>
                    </td>
                    <td>
                      <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>{u.role}</span>
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>{u.agency}</td>
                    <td>
                      {u.accountLocked ? (
                        <span className="badge badge-tampered">
                          <Lock size={12} /> LOCKED
                        </span>
                      ) : (
                        <span className="badge badge-verified">
                          <Unlock size={12} /> ACTIVE
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {u.accountLocked ? (
                        <button
                          onClick={() => handleUnlockUser(u.id)}
                          className="btn btn-success btn-sm"
                        >
                          <Unlock size={13} /> Unlock Account
                        </button>
                      ) : (
                        <button
                          onClick={() => handleLockUser(u.id)}
                          className="btn btn-outline btn-sm"
                          disabled={u.role === 'ADMIN'}
                        >
                          <Lock size={13} /> Lock Account
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Security Alerts List */}
      <div className="card">
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '18px', color: '#fff' }}>
          Forensic Anomaly Log Stream
        </h2>

        {alerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <CheckCircle2 size={32} color="var(--verified-green)" style={{ margin: '0 auto 10px auto' }} />
            No security violations or anomaly alerts currently logged.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {alerts.map((alert) => (
              <div key={alert.id} style={{
                padding: '16px 20px',
                borderRadius: '10px',
                backgroundColor: alert.riskScore >= 75 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                border: alert.riskScore >= 75 ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '14px'
              }}>
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      color: alert.riskScore >= 75 ? '#f87171' : '#fbbf24'
                    }}>
                      {alert.ruleViolated}
                    </span>
                    <span className="badge" style={{
                      backgroundColor: alert.riskScore >= 75 ? 'var(--tampered-red-bg)' : 'var(--warning-amber-bg)',
                      color: alert.riskScore >= 75 ? 'var(--tampered-red)' : 'var(--warning-amber)',
                      fontSize: '0.68rem'
                    }}>
                      Risk Score: {alert.riskScore}/100
                    </span>
                    {alert.resolved && (
                      <span className="badge badge-verified" style={{ fontSize: '0.65rem' }}>
                        RESOLVED
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>
                    Target Account: <span style={{ color: 'var(--accent-blue)' }}>@{alert.username}</span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '4px' }}>
                    {alert.details}
                  </div>

                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '8px' }}>
                    Detected at: {new Date(alert.timestamp).toLocaleString()}
                  </div>
                </div>

                {!alert.resolved && (
                  <button
                    onClick={() => handleResolve(alert.id)}
                    className="btn btn-outline btn-sm"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
