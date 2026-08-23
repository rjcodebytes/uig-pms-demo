'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Toast from '@/components/ui/Toast';

export default function VendorForm({ purchase }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    purchaseOrder: purchase.purchase_order || '',
    vendorName: purchase.vendor_name || '',
    paymentDetails: purchase.payment_details || '',
    remark: purchase.remark || '',
    status: purchase.status || 'Pending',
  });
  const [file, setFile] = useState(null);

  const set = k => e => setForm({ ...form, [k]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData();
    fd.append('purchaseOrder', form.purchaseOrder);
    fd.append('vendorName', form.vendorName);
    fd.append('paymentDetails', form.paymentDetails);
    fd.append('remark', form.remark);
    fd.append('status', form.status);
    if (file) fd.append('contractDocument', file);

    const res = await fetch(`/api/purchases/${purchase.purchase_id}/vendor`, { method: 'PUT', body: fd });
    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setToast({ msg: 'Vendor details updated!', type: 'success' });
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
            <label className="form-label">Purchase Order No.</label>
            <input className="form-control" value={form.purchaseOrder} onChange={set('purchaseOrder')} />
          </div>
          <div className="form-group">
            <label className="form-label">Vendor Name</label>
            <input className="form-control" value={form.vendorName} onChange={set('vendorName')} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Payment Details</label>
          <textarea className="form-control" value={form.paymentDetails} onChange={set('paymentDetails')} rows={3} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Upload Contract (PDF)</label>
            <input type="file" accept=".pdf" className="form-control" onChange={e => setFile(e.target.files[0])} />
            {purchase.contract_doc && <div style={{ fontSize: 11, color: '#10b981', marginTop: 4 }}>✓ Contract currently uploaded</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Status *</label>
            <select className="form-control" value={form.status} onChange={set('status')}>
              <option>Pending</option>
              <option>Complete</option>
              <option>Not Complete</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Remark</label>
          <input className="form-control" value={form.remark} onChange={set('remark')} />
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving…' : '💾 Save Vendor Details'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => router.push('/storekeeper/purchase/created')}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
