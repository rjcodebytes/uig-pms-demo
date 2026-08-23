'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Toast from '@/components/ui/Toast';

export default function CreatePurchaseForm({ documentId, users }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    purchase_id: '',
    start_date: '',
    end_date: '',
    committee_members: [],
  });
  const [file, setFile] = useState(null);

  const set = k => e => setForm({ ...form, [k]: e.target.value });

  const toggleMember = (id) => {
    setForm(prev => {
      const isSelected = prev.committee_members.includes(id);
      return {
        ...prev,
        committee_members: isSelected
          ? prev.committee_members.filter(m => m !== id)
          : [...prev.committee_members, id]
      };
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.committee_members.length === 0) {
      return setToast({ msg: 'Select at least one committee member', type: 'error' });
    }
    setLoading(true);

    const fd = new FormData();
    fd.append('purchase_id', form.purchase_id);
    fd.append('start_date', form.start_date);
    fd.append('end_date', form.end_date);
    form.committee_members.forEach(m => fd.append('committee_members', m));
    if (file) fd.append('document', file);

    const res = await fetch(`/api/purchases/${documentId}`, { method: 'POST', body: fd });
    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setToast({ msg: 'Purchase record created!', type: 'success' });
      setTimeout(() => router.push('/storekeeper/purchase/created'), 1200);
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
            <label className="form-label">Purchase ID (PO Number) *</label>
            <input className="form-control" value={form.purchase_id} onChange={set('purchase_id')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Upload Document (Optional)</label>
            <input type="file" accept=".pdf" className="form-control" onChange={e => setFile(e.target.files[0])} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Start Date *</label>
            <input type="date" className="form-control" value={form.start_date} onChange={set('start_date')} required />
          </div>
          <div className="form-group">
            <label className="form-label">End Date *</label>
            <input type="date" className="form-control" value={form.end_date} onChange={set('end_date')} required />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Purchase Committee Members *</label>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
            maxHeight: 200, overflowY: 'auto', padding: 12,
            background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10
          }}>
            {users.map(u => (
              <label key={u._id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={form.committee_members.includes(u._id)}
                  onChange={() => toggleMember(u._id)}
                />
                <div>
                  <div style={{ fontWeight: 600 }}>{u.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{u.position || u.department || 'User'}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating…' : '✅ Create Purchase Record'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => router.push('/storekeeper/purchase')}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
