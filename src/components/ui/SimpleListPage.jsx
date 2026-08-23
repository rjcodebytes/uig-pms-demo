'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Toast from '@/components/ui/Toast';
import Link from 'next/link';

export default function SimpleListPage({ title, items, addHref, editBase, deleteBase, apiBase, backHref }) {
  const router = useRouter();
  const [toast, setToast] = useState(null);

  async function handleDelete(id) {
    if (!confirm(`Delete this ${title.slice(0, -1)}?`)) return;
    const res = await fetch(`${apiBase}/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setToast({ msg: `${title.slice(0, -1)} deleted!`, type: 'success' });
      router.refresh();
    } else {
      setToast({ msg: 'Delete failed', type: 'error' });
    }
  }

  return (
    <>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="page-title">{title}</div>
          <div className="breadcrumb">
            <a href={backHref}>Home</a><span className="breadcrumb-sep">/</span>{title}
          </div>
        </div>
        <Link href={addHref} className="btn btn-primary">➕ Add {title.slice(0, -1)}</Link>
      </div>
      <div className="card">
        <div className="card-header">
          <span className="card-title">All {title} ({items.length})</span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                {items[0]?.description !== undefined && <th>Description</th>}
                {items[0]?.estimated_cost !== undefined && <th>Est. Cost</th>}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>No {title.toLowerCase()} found</td></tr>
              ) : items.map((item, i) => (
                <tr key={item._id}>
                  <td style={{ color: 'var(--text-secondary)' }}>{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{item.name}</td>
                  {item.description !== undefined && <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{item.description || '—'}</td>}
                  {item.estimated_cost !== undefined && <td style={{ color: '#fbbf24' }}>₹{item.estimated_cost}</td>}
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link href={`${editBase}/${item._id}/edit`} className="btn btn-secondary btn-sm">✏️ Edit</Link>
                      <button onClick={() => handleDelete(item._id)} className="btn btn-danger btn-sm">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
