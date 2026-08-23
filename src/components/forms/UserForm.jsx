'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Toast from '@/components/ui/Toast';

export default function UserForm({ initialData, roles, departments, positions }) {
  const router = useRouter();
  const isEdit = !!initialData;
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    mobile: initialData?.mobile || '',
    gender: initialData?.gender || 'Male',
    username: initialData?.username || '',
    password: '',
    roleId: initialData?.role?._id || '',
    position: initialData?.position || '',
    department: initialData?.department || '',
  });

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const url = isEdit ? `/api/users/${initialData._id}` : '/api/users';
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setToast({ msg: isEdit ? 'User updated!' : 'User created!', type: 'success' });
      setTimeout(() => router.push('/admin/users'), 1200);
    } else {
      setToast({ msg: data.error || 'Failed', type: 'error' });
    }
  }

  return (
    <>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input className="form-control" value={form.name} onChange={set('name')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Username *</label>
            <input className="form-control" value={form.username} onChange={set('username')} required disabled={isEdit} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input type="email" className="form-control" value={form.email} onChange={set('email')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Mobile *</label>
            <input className="form-control" value={form.mobile} onChange={set('mobile')} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Gender *</label>
            <select className="form-control" value={form.gender} onChange={set('gender')}>
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Password {isEdit ? '(leave blank to keep)' : '*'}</label>
            <input type="password" className="form-control" value={form.password} onChange={set('password')} required={!isEdit} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Role *</label>
            <select className="form-control" value={form.roleId} onChange={set('roleId')} required>
              <option value="">Select Role</option>
              {roles.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Position</label>
            <select className="form-control" value={form.position} onChange={set('position')}>
              <option value="">None</option>
              {positions.map(p => <option key={p._id} value={p.name}>{p.name}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Department</label>
          <select className="form-control" value={form.department} onChange={set('department')}>
            <option value="">None</option>
            {departments.map(d => <option key={d._id} value={d.name}>{d.name}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving…' : (isEdit ? '💾 Update User' : '➕ Create User')}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => router.push('/admin/users')}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
