import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { Shield, Lock, User, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('officer_chen');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const demoAccounts = [
    { name: 'Inspector Chen', role: 'POLICE', u: 'officer_chen', p: 'Password123!', agency: 'Metropolitan Police' },
    { name: 'Agent Miller', role: 'FEDERAL', u: 'agent_miller', p: 'Password123!', agency: 'Federal Investigation Agency' },
    { name: 'Judge Vance', role: 'JUDGE', u: 'judge_vance', p: 'Password123!', agency: 'District High Court' },
    { name: 'System Admin', role: 'ADMIN', u: 'admin', p: 'AdminPassword123!', agency: 'EvidenceChain HQ' },
  ];

  const handleQuickSelect = (acc) => {
    setUsername(acc.u);
    setPassword(acc.p);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authService.login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'radial-gradient(ellipse at 50% 20%, rgba(56, 189, 248, 0.08), transparent 70%), var(--bg-primary)'
    }}>
      <div style={{ width: '100%', maxWidth: '460px' }}>
        {/* Brand Banner */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            backgroundColor: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            marginBottom: '16px'
          }}>
            <Shield size={36} color="var(--accent-blue)" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
            Evidence<span style={{ color: 'var(--accent-blue)' }}>Chain</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '6px' }}>
            AI-Assisted Blockchain Cybercrime Evidence Management
          </p>
        </div>

        {/* Login Card */}
        <div className="card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '20px' }}>
            Officer Sign In
          </h2>

          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '12px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              fontSize: '0.85rem',
              marginBottom: '20px'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '38px' }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter officer username"
                />
                <User size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '38px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
                <Lock size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '10px', padding: '12px' }}
            >
              {loading ? 'Authenticating...' : 'Sign In to Terminal'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* College Demo Quick Fill */}
          <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.05em' }}>
              Quick Demo Personas (Select to Auto-Fill):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {demoAccounts.map((acc) => (
                <button
                  key={acc.u}
                  type="button"
                  onClick={() => handleQuickSelect(acc)}
                  className="btn btn-outline btn-sm"
                  style={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    padding: '8px 10px',
                    borderColor: username === acc.u ? 'var(--accent-blue)' : 'var(--border-color)',
                    backgroundColor: username === acc.u ? 'rgba(56, 189, 248, 0.08)' : 'transparent'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>{acc.name}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{acc.role}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          Session: Statutory Multi-Agency Chain-of-Custody Compliant | ISO/IEC 27037 Forensics Standard
        </div>
      </div>
    </div>
  );
}
