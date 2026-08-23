'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Toast from '@/components/ui/Toast';

export default function SimpleForm({ title, initialData, apiBase, redirectTo, fields }) {
  const router = useRouter();
  const isEdit = !!initialData;
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(
    fields.reduce((acc, f) => ({ ...acc, [f.key]: initialData?.[f.key] || '' }), {})
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const url = isEdit ? `${apiBase}/${initialData._id}` : apiBase;
    const res = await fetch(url, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setToast({ msg: `${title} ${isEdit ? 'updated' : 'created'}!`, type: 'success' });
      setTimeout(() => router.push(redirectTo), 1000);
    } else {
      setToast({ msg: data.error || 'Failed', type: 'error' });
    }
  }

  return (
    <>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <form onSubmit={handleSubmit}>
        {fields.map(f => (
          <div className="form-group" key={f.key}>
            <label className="form-label">{f.label} {f.required && '*'}</label>
            {f.type === 'textarea' ? (
              <textarea className="form-control" value={form[f.key]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                required={f.required} rows={3} />
            ) : (
              <input type={f.type || 'text'} className="form-control" value={form[f.key]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                required={f.required} placeholder={f.placeholder} />
            )}
          </div>
        ))}
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving…' : (isEdit ? `💾 Update ${title}` : `➕ Add ${title}`)}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => router.push(redirectTo)}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
