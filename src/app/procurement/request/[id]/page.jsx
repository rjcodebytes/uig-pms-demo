'use client';
import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, XCircle, FileText, UploadCloud, Check, Truck, DollarSign } from 'lucide-react';
import QuotationComparison from '@/components/procurement/QuotationComparison';

export default function RequestDetailsPage({ params }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Quote form state
  const [quotes, setQuotes] = useState([
    { vendorName: 'Vendor A', totalPrice: 40000, leadTimeDays: 7, specificationsText: 'Standard spec' },
    { vendorName: 'Vendor B', totalPrice: 38000, leadTimeDays: 14, specificationsText: 'Alternative brand' },
    { vendorName: 'Vendor C', totalPrice: 45000, leadTimeDays: 5, specificationsText: 'Premium spec, fast delivery' }
  ]);

  const fetchRequest = async () => {
    try {
      const res = await fetch(`/api/v1/requests/${id}`);
      const data = await res.json();
      if (data.success) {
        setRequest(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const handleAction = async (endpoint, payload) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/v1/requests/${id}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setRequest(data.data);
      }
    } catch (err) {
      console.error(err);
    }
    setActionLoading(false);
  };

  const submitQuotations = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/v1/requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          vendorQuotations: quotes,
          status: 'Technical_Approval'
        })
      });
      const data = await res.json();
      if (data.success) {
        await handleAction('technical-approve', { isApproved: true, notes: 'Auto-triggered Technical Approval phase.' }); // just to add timeline
        fetchRequest();
      }
    } catch (err) {
      console.error(err);
    }
    setActionLoading(false);
  };

  if (loading) return <div className="min-h-screen bg-zinc-950 p-12 text-zinc-500 animate-pulse text-center">Loading Data...</div>;
  if (!request) return <div className="min-h-screen bg-zinc-950 p-12 text-red-500 text-center">Request Not Found</div>;

  return (
    <div className="min-h-screen bg-zinc-950 p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-indigo-900/10 to-transparent pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10 space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <button onClick={() => router.push('/procurement/dashboard')} className="text-zinc-500 hover:text-white flex items-center text-sm mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </button>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center">
              <span className="w-2 h-8 bg-indigo-500 rounded-full mr-3 glow-border"></span>
              {request.ticketId}
            </h1>
            <p className="text-zinc-400 mt-2">{request.project.projectName} • {request.location}</p>
          </div>
          <div>
            <span className="px-4 py-2 rounded-full bg-zinc-900/50 border border-white/10 text-white font-bold tracking-wide">
              {request.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Details Card */}
        <div className="glass-card rounded-2xl p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-zinc-500 font-medium">Requester</p>
              <p className="text-lg font-bold text-white">{request.requester}</p>
              <p className="text-sm text-zinc-400">{request.department}</p>
            </div>
            <div>
              <p className="text-sm text-zinc-500 font-medium">Item Details</p>
              <p className="text-lg font-bold text-white">{request.itemDetails.name}</p>
              <p className="text-sm text-zinc-400">Qty: {request.itemDetails.quantity}</p>
            </div>
            <div>
              <p className="text-sm text-zinc-500 font-medium">Timeline Log</p>
              <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                {request.timeline.slice().reverse().map((t, i) => (
                  <p key={i} className="text-xs text-zinc-400 border-l-2 border-indigo-500/50 pl-2">
                    <span className="font-semibold text-zinc-300">{t.status}</span>: {t.notes}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* WORKFLOW PANELS */}
        
        {/* Step 1: Quotation Collection */}
        {request.status === 'Incoming' || request.status === 'Quotation_Collection' ? (
          <div className="glass-card rounded-2xl p-6 md:p-8 border-indigo-500/30">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <UploadCloud className="w-6 h-6 mr-3 text-indigo-400" /> Upload Vendor Quotations
            </h3>
            <p className="text-zinc-400 mb-6 text-sm">Please upload exactly 3 competitive vendor quotations to proceed to technical approval.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {quotes.map((q, i) => (
                <div key={i} className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                  <p className="font-bold text-white mb-2">{q.vendorName}</p>
                  <p className="text-sm text-zinc-400">Price: {q.totalPrice} SAR</p>
                  <p className="text-sm text-zinc-400">Lead Time: {q.leadTimeDays} Days</p>
                </div>
              ))}
            </div>
            
            <button 
              onClick={submitQuotations}
              disabled={actionLoading}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all disabled:opacity-50"
            >
              {actionLoading ? 'Processing...' : 'Submit 3 Quotations'}
            </button>
          </div>
        ) : null}

        {/* Step 2: Technical & Finance Approvals (If Quotations Exist) */}
        {request.vendorQuotations && request.vendorQuotations.length > 0 && (
          <QuotationComparison quotations={request.vendorQuotations} />
        )}

        {request.status === 'Technical_Approval' && (
          <div className="glass-card rounded-2xl p-6 md:p-8 border-orange-500/30">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center">
              <CheckCircle className="w-6 h-6 mr-3 text-orange-400" /> Requester Technical Approval
            </h3>
            <p className="text-zinc-400 mb-6 text-sm">Please review the specifications above and confirm they meet the project requirements.</p>
            <div className="flex space-x-4">
              <button 
                onClick={() => handleAction('technical-approve', { isApproved: true })}
                disabled={actionLoading}
                className="px-6 py-3 bg-emerald-600/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-600/40 rounded-xl font-medium transition-all"
              >
                Approve Technically
              </button>
              <button 
                onClick={() => handleAction('technical-approve', { isApproved: false })}
                disabled={actionLoading}
                className="px-6 py-3 bg-red-600/20 text-red-400 border border-red-500/50 hover:bg-red-600/40 rounded-xl font-medium transition-all"
              >
                Reject
              </button>
            </div>
          </div>
        )}

        {request.status === 'Finance_Review' && (
          <div className="glass-card rounded-2xl p-6 md:p-8 border-amber-500/30">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center">
              <DollarSign className="w-6 h-6 mr-3 text-amber-400" /> Finance Approval & Budget Check
            </h3>
            <p className="text-zinc-400 mb-6 text-sm">Verify the selected quotation against the allocated budget for {request.project.projectName}.</p>
            <div className="flex space-x-4">
              <button 
                onClick={() => handleAction('finance-review', { isApproved: true })}
                disabled={actionLoading}
                className="px-6 py-3 bg-amber-600/20 text-amber-400 border border-amber-500/50 hover:bg-amber-600/40 rounded-xl font-medium transition-all"
              >
                Approve & Generate PO
              </button>
              <button 
                onClick={() => handleAction('finance-review', { isApproved: false })}
                disabled={actionLoading}
                className="px-6 py-3 bg-red-600/20 text-red-400 border border-red-500/50 hover:bg-red-600/40 rounded-xl font-medium transition-all"
              >
                Reject Budget
              </button>
            </div>
          </div>
        )}

        {request.status === 'PO_Generated' && (
          <div className="glass-card rounded-2xl p-6 md:p-8 border-emerald-500/30">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-emerald-400" /> Purchase Order Generated
            </h3>
            <p className="text-zinc-400 mb-6 text-sm">The PO has been sent to the vendor. Awaiting delivery confirmation.</p>
            <button 
              onClick={() => handleAction('lifecycle', { action: 'DELIVERY_CONFIRMED' })}
              disabled={actionLoading}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-all"
            >
              Upload Delivery Note & Confirm
            </button>
          </div>
        )}

        {request.status === 'Delivery_Pending' && (
          <div className="glass-card rounded-2xl p-6 md:p-8 border-teal-500/30">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center">
              <Truck className="w-6 h-6 mr-3 text-teal-400" /> Goods Delivered
            </h3>
            <p className="text-zinc-400 mb-6 text-sm">Site has confirmed receipt. Finance must now process final payment to the vendor.</p>
            <button 
              onClick={() => handleAction('lifecycle', { action: 'PAYMENT_PROCESSED' })}
              disabled={actionLoading}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-medium transition-all"
            >
              Process Vendor Payment & Close Ticket
            </button>
          </div>
        )}

        {request.status === 'Completed' && (
          <div className="bg-zinc-800/50 rounded-2xl p-6 md:p-8 border border-zinc-700 text-center">
            <Check className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-zinc-400 mb-2">Ticket Closed</h3>
            <p className="text-zinc-500">All procurement, delivery, and financial obligations have been settled.</p>
          </div>
        )}

        {request.status === 'Rejected_Job' && (
          <div className="bg-red-900/20 rounded-2xl p-6 md:p-8 border border-red-900/50 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-red-400 mb-2">Ticket Rejected</h3>
            <p className="text-red-300/50">This request was rejected during the approval workflow.</p>
          </div>
        )}

      </div>
    </div>
  );
}
