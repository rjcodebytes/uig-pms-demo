'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Toast from '@/components/ui/Toast';

export default function ReviewForm({ documentId, currentStatus }) {
  const router = useRouter();
  const [remark, setRemark] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  if (currentStatus !== 'Pending') {
    return (
      <div className="alert alert-info">
        ℹ️ You have already <strong>{currentStatus.toLowerCase()}</strong> this document.
      </div>
    );
  }

  async function handleAction(action) {
    if (!remark) return setToast({ msg: 'Please provide a remark', type: 'error' });
    if (!confirm(`Are you sure you want to ${action.toUpperCase()} this document?`)) return;

    setLoading(true);
    const res = await fetch(`/api/workflow/${documentId}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, remark }),
    });
    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setToast({ msg: `Document ${action.toLowerCase()}!`, type: 'success' });
      setTimeout(() => router.push('/approver/procurement'), 1200);
    } else {
      setToast({ msg: data.error || 'Failed', type: 'error' });
    }
  }

  return (
    <>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Your Review</h3>
        <div className="form-group">
          <label className="form-label">Remark / Comments *</label>
          <textarea
            className="form-control"
            value={remark}
            onChange={e => setRemark(e.target.value)}
            placeholder="Enter your approval/rejection remarks here..."
            rows={4}
            disabled={loading}
          />
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => handleAction('Approved')} className="btn btn-success" disabled={loading}>
            ✅ Approve & Forward
          </button>
          <button onClick={() => handleAction('Rejected')} className="btn btn-danger" disabled={loading}>
            ❌ Reject Document
          </button>
        </div>
      </div>
    </>
  );
}
