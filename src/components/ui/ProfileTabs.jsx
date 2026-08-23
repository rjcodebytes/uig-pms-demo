'use client';
import { useState } from 'react';
import Toast from '@/components/ui/Toast';

export default function ProfileTabs({ user }) {
  const [tab, setTab] = useState('overview');
  const [toast, setToast] = useState(null);
  const [profileForm, setProfileForm] = useState({ fullName: user?.name || '', email: user?.email || '' });
  const [pwForm, setPwForm] = useState({ password: '', newpassword: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  async function handleProfileSave(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'profile', ...profileForm }),
    });
    const data = await res.json();
    setLoading(false);
    setToast(data.success ? { msg: 'Profile updated!', type: 'success' } : { msg: data.error, type: 'error' });
  }

  async function handlePasswordChange(e) {
    e.preventDefault();
    if (pwForm.newpassword !== pwForm.confirm) {
      return setToast({ msg: 'New passwords do not match', type: 'error' });
    }
    setLoading(true);
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'password', password: pwForm.password, newpassword: pwForm.newpassword }),
    });
    const data = await res.json();
    setLoading(false);
    setToast(data.success ? { msg: 'Password changed!', type: 'success' } : { msg: data.error, type: 'error' });
    if (data.success) setPwForm({ password: '', newpassword: '', confirm: '' });
  }

  return (
    <>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="tab-list">
        {['overview', 'edit', 'password'].map(t => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'overview' ? '👤 Overview' : t === 'edit' ? '✏️ Edit Profile' : '🔑 Password'}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div style={{ display: 'grid', gap: 14 }}>
          {[
            ['Full Name', user?.name],
            ['Email', user?.email],
            ['Mobile', user?.mobile],
            ['Gender', user?.gender],
            ['Username', user?.username],
            ['Role', user?.role],
            ['Position', user?.position || '—'],
            ['Department', user?.department || '—'],
          ].map(([label, val]) => (
            <div key={label} style={{ display: 'flex', gap: 16, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: 140, color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600 }}>{label}</div>
              <div style={{ flex: 1, color: 'var(--text-primary)', fontSize: 13 }}>{val || '—'}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'edit' && (
        <form onSubmit={handleProfileSave}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-control" value={profileForm.fullName}
              onChange={e => setProfileForm({ ...profileForm, fullName: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={profileForm.email}
              onChange={e => setProfileForm({ ...profileForm, email: e.target.value })} required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving…' : '💾 Save Changes'}
          </button>
        </form>
      )}

      {tab === 'password' && (
        <form onSubmit={handlePasswordChange}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input type="password" className="form-control" value={pwForm.password}
              onChange={e => setPwForm({ ...pwForm, password: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input type="password" className="form-control" value={pwForm.newpassword}
              onChange={e => setPwForm({ ...pwForm, newpassword: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input type="password" className="form-control" value={pwForm.confirm}
              onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })} required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Updating…' : '🔑 Change Password'}
          </button>
        </form>
      )}
    </>
  );
}
