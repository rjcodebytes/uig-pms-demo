'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Toast from '@/components/ui/Toast';

export default function CreateDocumentForm({ purchaseTypes, initialData }) {
  const router = useRouter();
  const isEdit = !!initialData;
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    doc_title: initialData?.doc_title || '',
    doc_desc: initialData?.doc_desc || '',
    purchase_type: initialData?.purchase_type?._id || '',
  });
  const [file, setFile] = useState(null);

  const set = k => e => setForm({ ...form, [k]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isEdit && !file) return setToast({ msg: 'Please select a PDF file', type: 'error' });
    setLoading(true);
    const fd = new FormData();
    fd.append('doc_title', form.doc_title);
    fd.append('doc_desc', form.doc_desc);
    fd.append('purchase_type', form.purchase_type);
    if (file) fd.append('document', file);

    const res = await fetch(isEdit ? `/api/documents/${initialData._id}` : '/api/documents', {
      method: isEdit ? 'PUT' : 'POST',
      body: fd,
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setToast({ msg: isEdit ? 'Document updated!' : 'Document submitted!', type: 'success' });
      setTimeout(() => router.push('/initiator/procurement'), 1200);
    } else {
      setToast({ msg: data.error || 'Failed', type: 'error' });
    }
  }

  return (
    <>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Document Title *</label>
          <input className="form-control" value={form.doc_title} onChange={set('doc_title')} required />
        </div>
        <div className="form-group">
          <label className="form-label">Description *</label>
          <textarea className="form-control" value={form.doc_desc} onChange={set('doc_desc')} required rows={4} />
        </div>
        <div className="form-group">
          <label className="form-label">Purchase Type *</label>
          <select className="form-control" value={form.purchase_type} onChange={set('purchase_type')} required>
            <option value="">Select Purchase Type</option>
            {purchaseTypes.map(pt => (
              <option key={pt._id} value={pt._id}>{pt.name} — ₹{pt.estimated_cost}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Upload PDF {isEdit ? '(leave empty to keep existing)' : '*'}</label>
          <input type="file" accept=".pdf" className="form-control"
            onChange={e => setFile(e.target.files[0])}
            required={!isEdit}
          />
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>Max 300KB, PDF only</div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Uploading…' : (isEdit ? '💾 Update & Resubmit' : '📤 Submit Document')}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => router.push('/initiator/procurement')}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
