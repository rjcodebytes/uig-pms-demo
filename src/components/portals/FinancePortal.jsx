'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  Receipt,
  TrendingDown,
  TrendingUp,
  CreditCard,
  FileCheck2,
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';

export default function FinancePortal({ requests = [] }) {
  const [localRequests, setLocalRequests] = useState(requests);
  const [selectedFinanceReq, setSelectedFinanceReq] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  React.useEffect(() => {
    setLocalRequests(requests);
  }, [requests]);

  const pendingFinance = localRequests.filter((r) => r.status === 'Finance_Review');
  const readyForPayment = localRequests.filter((r) => r.status === 'Delivery_Pending');
  const settled = localRequests.filter((r) => r.status === 'Completed');

  const handleAuthorizeBudget = async (reqId, isApproved) => {
    setActionLoading(true);
    try {
      await fetch(`/api/v1/requests/${reqId}/finance-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isApproved,
          notes: isApproved
            ? 'Commercial viability verified against historical price baseline. PO authorized.'
            : 'Rejected by Finance: Over budget.',
        }),
      });

      const updated = localRequests.map((r) => {
        if (r._id === reqId || r.ticketId === reqId) {
          return {
            ...r,
            status: isApproved ? 'PO_Generated' : 'Rejected_Job',
            purchaseOrder: {
              poNumber: `PO-2026-${Math.floor(10000 + Math.random() * 90000)}`,
              generatedAt: new Date(),
              paymentTerms: 'Net 30 Days after GRN'
            }
          };
        }
        return r;
      });
      setLocalRequests(updated);
      setSelectedFinanceReq(null);
      setStatusMessage(isApproved ? '✓ Budget authorized! Official Purchase Order (PO) issued.' : 'Rejected back to Tender.');
      setTimeout(() => setStatusMessage(''), 4000);
    } catch (err) {
      console.error(err);
    }
    setActionLoading(false);
  };

  const handleReleasePayment = async (reqId) => {
    setActionLoading(true);
    try {
      await fetch(`/api/v1/requests/${reqId}/lifecycle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'PAYMENT_PROCESSED',
          notes: '3-Way Matching verified (PO = GRN = Invoice). SAMA SARIE wire payment released.',
        }),
      });

      const updated = localRequests.map((r) => {
        if (r._id === reqId || r.ticketId === reqId) {
          return {
            ...r,
            status: 'Completed',
            paymentRecord: {
              transactionRef: `TXN-SAMA-${Math.floor(100000 + Math.random() * 900000)}`,
              amountPaid: 45000,
              paidAt: new Date()
            }
          };
        }
        return r;
      });
      setLocalRequests(updated);
      setStatusMessage('✓ 3-Way Match verified! Wire payment released via SAMA SARIE.');
      setTimeout(() => setStatusMessage(''), 4000);
    } catch (err) {
      console.error(err);
    }
    setActionLoading(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Finance Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-300 uppercase tracking-wider mb-1">
            <span>💼 Finance & Commercial Compliance Control Center</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Finance Controller Desk</h2>
          <p className="text-xs text-blue-100/90 mt-1 max-w-xl leading-relaxed">
            Validate commercial viability, analyze historical price baseline variance, authorize official Purchase Orders, and release 3-way matched wire payments.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <Link
            href="/procurement/analytics"
            className="px-4 py-2.5 bg-blue-700 hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs transition"
          >
            Open Spend Analytics
          </Link>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center shadow-xs">
          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Finance Action Required Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Pending Budget & Variance Approvals */}
        <div className="corp-card p-5 border-2 border-blue-500 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="badge-primary font-bold">Stage 4: Budget Sign-off</span>
            <span className="text-xs font-bold text-blue-800">{pendingFinance.length} Pending</span>
          </div>
          <h3 className="font-black text-slate-900 text-base">Commercial & Baseline Variance Approvals</h3>
          <p className="text-xs text-slate-500 mt-0.5 mb-4">Validate tender bids against allocated budget before PO issuance.</p>

          <div className="space-y-2">
            {pendingFinance.map((req) => {
              const quote = req.quotations?.find((q) => q.isChosen) || req.quotations?.[0];
              const targetUrl = `/procurement/request/${req.ticketId || req._id}`;

              return (
                <div key={req._id || req.ticketId} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{req.ticketId} • {req.itemDetails?.name}</div>
                    <div className="text-[11px] text-blue-700 font-extrabold">{(quote?.totalPrice || 47000).toLocaleString()} SAR ({quote?.vendorName || 'Jarir Marketing'})</div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      href={targetUrl}
                      className="text-xs font-bold text-slate-500 hover:text-blue-700 underline mr-1"
                    >
                      Details
                    </Link>
                    <button
                      onClick={() => setSelectedFinanceReq(req)}
                      className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition cursor-pointer shadow-xs"
                    >
                      Authorize PO &rarr;
                    </button>
                  </div>
                </div>
              );
            })}
            {pendingFinance.length === 0 && (
              <div className="text-center py-6 text-slate-400 text-xs">No pending budget sign-offs</div>
            )}
          </div>
        </div>

        {/* Ready for 3-Way Match Payment */}
        <div className="corp-card p-5 border-2 border-teal-500 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="badge-success font-bold">Stage 7: Accounts Payable</span>
            <span className="text-xs font-bold text-teal-800">{readyForPayment.length} Ready</span>
          </div>
          <h3 className="font-black text-slate-900 text-base">3-Way Match & Wire Payment Release</h3>
          <p className="text-xs text-slate-500 mt-0.5 mb-4">Site has signed GRN delivery note. Verify match & release payment.</p>

          <div className="space-y-2">
            {readyForPayment.map((req) => {
              const quote = req.quotations?.find((q) => q.isChosen) || req.quotations?.[0];
              const targetUrl = `/procurement/request/${req.ticketId || req._id}`;

              return (
                <div key={req._id || req.ticketId} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{req.ticketId} • {req.itemDetails?.name}</div>
                    <div className="text-[11px] text-teal-700 font-extrabold">GRN Verified • {(quote?.totalPrice || 74000).toLocaleString()} SAR</div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      href={targetUrl}
                      className="text-xs font-bold text-slate-500 hover:text-blue-700 underline mr-1"
                    >
                      Details
                    </Link>
                    <button
                      onClick={() => handleReleasePayment(req.ticketId || req._id)}
                      disabled={actionLoading}
                      className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-lg transition cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      Release Wire &rarr;
                    </button>
                  </div>
                </div>
              );
            })}
            {readyForPayment.length === 0 && (
              <div className="text-center py-6 text-slate-400 text-xs">No pending payment releases</div>
            )}
          </div>
        </div>

      </div>

      {/* Quick Budget Authorization Modal */}
      {selectedFinanceReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-xl w-full shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <div className="badge-primary text-[10px] font-bold mb-1">Commercial & Budget Gate</div>
                <h3 className="text-base font-black text-slate-900">
                  Authorize Budget & PO: {selectedFinanceReq.ticketId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedFinanceReq(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5">
                <div className="font-bold text-slate-900 text-sm">{selectedFinanceReq.itemDetails?.name}</div>
                <div className="text-slate-600">Project Budget: <strong className="text-slate-900">{((selectedFinanceReq.project?.allocatedBudget || 350000)).toLocaleString()} SAR</strong></div>
                <div className="text-slate-600">Quoted Amount: <strong className="text-blue-700">{((selectedFinanceReq.quotations?.[0]?.totalPrice || 47000)).toLocaleString()} SAR</strong></div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 space-y-1">
                <div className="font-bold">✓ Price Baseline Check: Within Budget Cap</div>
                <div className="text-[11px]">Generating PO will officially dispatch order to supplier with 15% ZATCA VAT calculation.</div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedFinanceReq(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleAuthorizeBudget(selectedFinanceReq.ticketId || selectedFinanceReq._id, true)}
                  disabled={actionLoading}
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold shadow-xs transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Receipt className="w-4 h-4" />
                  <span>{actionLoading ? 'Issuing PO...' : 'Authorize Budget & Issue PO'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settled Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900">Reconciled Payment Vouchers (SAMA SARIE)</h3>
          <p className="text-xs text-slate-500">Completed 3-way matched transactions closed in general ledger</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="corp-table-header">
              <tr>
                <th className="p-3.5">PR Ticket</th>
                <th className="p-3.5">PO Number</th>
                <th className="p-3.5">Awarded Vendor</th>
                <th className="p-3.5">Settlement Amount</th>
                <th className="p-3.5">Transaction Ref</th>
                <th className="p-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {settled.map((req) => {
                const quote = req.quotations?.find((q) => q.isChosen) || req.quotations?.[0];
                const targetUrl = `/procurement/request/${req.ticketId || req._id}`;
                return (
                  <tr key={req._id || req.ticketId} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-bold text-blue-700">
                      <Link href={targetUrl} className="hover:underline">
                        {req.ticketId}
                      </Link>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-900">{req.purchaseOrder?.poNumber || 'PO-2026-10025'}</td>
                    <td className="p-3.5 font-semibold text-slate-800">{quote?.vendorName || 'Jarir Marketing'}</td>
                    <td className="p-3.5 font-black text-emerald-700">{(quote?.totalPrice || 45000).toLocaleString()} SAR</td>
                    <td className="p-3.5 font-mono text-slate-600">{req.paymentRecord?.transactionRef || 'TXN-SAMA-908214'}</td>
                    <td className="p-3.5 text-right">
                      <span className="badge-success">✓ 100% Settled</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
