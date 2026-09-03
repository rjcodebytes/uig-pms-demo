'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckSquare,
  Building2,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  FileText,
  DollarSign,
  AlertOctagon,
  RotateCcw
} from 'lucide-react';

export default function ApproverPortal({ requests = [] }) {
  const [localRequests, setLocalRequests] = useState(requests);
  const [selectedReviewReq, setSelectedReviewReq] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Rejection / Flag modal state inside queue
  const [isRejectMode, setIsRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState('Substandard OEM Specifications / Wrong Model');
  const [rejectNotes, setRejectNotes] = useState('');

  // Sync with prop
  React.useEffect(() => {
    setLocalRequests(requests);
  }, [requests]);

  const pendingApprovals = localRequests.filter((r) => r.status === 'Technical_Approval');
  const inTender = localRequests.filter((r) => r.status === 'Quotation_Collection');
  const approvedHistory = localRequests.filter(
    (r) => r.status !== 'Incoming' && r.status !== 'Quotation_Collection' && r.status !== 'Technical_Approval'
  );

  const handleExecuteApproval = async (reqId) => {
    setActionLoading(true);
    try {
      await fetch(`/api/v1/requests/${reqId}/technical-approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isApproved: true,
          notes: 'Technical HOD verified OEM specs & certified compliance with project requirements.',
        }),
      });

      const updated = localRequests.map((r) => {
        if (r._id === reqId || r.ticketId === reqId) {
          return { ...r, status: 'Finance_Review' };
        }
        return r;
      });
      setLocalRequests(updated);
      setSelectedReviewReq(null);
      setStatusMessage('✓ Technically approved and routed to Finance Desk!');
      setTimeout(() => setStatusMessage(''), 4000);
    } catch (err) {
      console.error(err);
    }
    setActionLoading(false);
  };

  const handleExecuteFlagRejection = async (reqId) => {
    setActionLoading(true);
    try {
      await fetch(`/api/v1/requests/${reqId}/lifecycle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'FLAG_ISSUE',
          targetStage: 'Quotation_Collection',
          currentStage: 'Technical_Approval',
          reasonCategory: rejectReason,
          notes: rejectNotes || 'Technical HOD rejected specifications. Alternative compliant tender required.',
          flaggedBy: 'Technical Approver / HOD',
          flaggedRole: 'Approver',
        }),
      });

      const updated = localRequests.map((r) => {
        if (r._id === reqId || r.ticketId === reqId) {
          return {
            ...r,
            status: 'Quotation_Collection',
            flaggedIssue: {
              isFlagged: true,
              reasonCategory: rejectReason,
              comments: rejectNotes || 'Alternative compliant tender required.',
              flaggedBy: 'Technical Approver / HOD',
            },
          };
        }
        return r;
      });
      setLocalRequests(updated);
      setSelectedReviewReq(null);
      setIsRejectMode(false);
      setStatusMessage(`⚠️ Requisition flagged & reverted to Sourcing (${rejectReason})`);
      setTimeout(() => setStatusMessage(''), 4000);
    } catch (err) {
      console.error(err);
    }
    setActionLoading(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Approver Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-700 to-orange-800 text-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-200 uppercase tracking-wider mb-1">
            <span>📑 Technical Engineering & Specification Desk</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Technical Approvals Queue</h2>
          <p className="text-xs text-amber-100/90 mt-1 max-w-xl leading-relaxed">
            Review multi-vendor quotes for engineering compliance, technical standards, warranty SLAs, or flag non-compliant specifications back to procurement.
          </p>
        </div>

        <div className="bg-white/10 border border-white/20 rounded-xl p-3 text-center shrink-0">
          <div className="text-2xl font-black">{pendingApprovals.length}</div>
          <div className="text-[10px] uppercase font-bold text-amber-200">Awaiting Technical Sign-off</div>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center shadow-xs">
          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Urgent Approvals Awaiting Action */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">⚡ Pending Technical Specification Reviews:</div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingApprovals.map((req) => {
            const chosen = req.quotations?.find((q) => q.isChosen) || req.quotations?.[0];
            const targetUrl = `/procurement/request/${req.ticketId || req._id}`;

            return (
              <div key={req._id || req.ticketId} className="bg-white border-2 border-amber-300 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-blue-700 text-xs">{req.ticketId}</span>
                    <span className="badge-warning text-[10px] font-bold">Action Required</span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base">{req.itemDetails?.name}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">{req.project?.projectName} ({req.location})</div>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs my-3 space-y-1">
                    <div className="text-slate-500">
                      Recommended Vendor: <span className="font-bold text-slate-900">{chosen?.vendorName || 'Jarir Marketing Co.'}</span>
                    </div>
                    <div className="text-slate-500">
                      Bid Amount: <span className="font-black text-blue-800">{(chosen?.totalPrice || 47000).toLocaleString()} SAR</span>
                    </div>
                    <div className="text-slate-500">
                      Lead Time: <span className="font-semibold text-slate-800">{chosen?.leadTimeDays || 3} Days</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    href={targetUrl}
                    className="text-xs font-bold text-slate-600 hover:text-blue-700 underline"
                  >
                    View Full 3-Bid Matrix
                  </Link>

                  <button
                    onClick={() => {
                      setSelectedReviewReq(req);
                      setIsRejectMode(false);
                      setRejectNotes('');
                    }}
                    className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
                  >
                    <span>Execute Review</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {pendingApprovals.length === 0 && (
            <div className="col-span-2 bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400 text-xs font-medium">
              No technical reviews currently pending. All engineering queues are up to date!
            </div>
          )}
        </div>
      </div>

      {/* Quick Technical Review Modal */}
      {selectedReviewReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-xl w-full shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <div className="badge-warning text-[10px] font-bold mb-1">Technical Specification Gate</div>
                <h3 className="text-base font-black text-slate-900">
                  Engineering Sign-off: {selectedReviewReq.ticketId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReviewReq(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5">
                <div className="font-bold text-slate-900 text-sm">{selectedReviewReq.itemDetails?.name}</div>
                <div className="text-slate-600">Project: <strong className="text-slate-900">{selectedReviewReq.project?.projectName}</strong></div>
                <div className="text-slate-600">Site Location: <strong className="text-blue-700">{selectedReviewReq.location}</strong></div>
              </div>

              {!isRejectMode ? (
                <>
                  {/* Technical Verification Checklist */}
                  <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3.5 space-y-2">
                    <div className="font-bold text-amber-900 uppercase tracking-wider text-[10px]">Technical Verification Checklist:</div>
                    <div className="flex items-center text-slate-700">
                      <Check className="w-3.5 h-3.5 mr-2 text-emerald-600" />
                      <span>OEM Specifications & Standards confirmed compliant</span>
                    </div>
                    <div className="flex items-center text-slate-700">
                      <Check className="w-3.5 h-3.5 mr-2 text-emerald-600" />
                      <span>Delivery lead time fits project critical path</span>
                    </div>
                    <div className="flex items-center text-slate-700">
                      <Check className="w-3.5 h-3.5 mr-2 text-emerald-600" />
                      <span>Warranty & After-Sales SLA certified (24–36 Months)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsRejectMode(true)}
                      className="px-4 py-2 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 rounded-xl font-bold cursor-pointer transition flex items-center space-x-1.5"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Flag Issue & Revert</span>
                    </button>

                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/procurement/request/${selectedReviewReq.ticketId || selectedReviewReq._id}`}
                        className="px-3.5 py-2 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl font-bold"
                      >
                        Open Full Details
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleExecuteApproval(selectedReviewReq.ticketId || selectedReviewReq._id)}
                        disabled={actionLoading}
                        className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-xs transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                        <span>{actionLoading ? 'Approving...' : 'Approve & Send to Finance'}</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Rejection Sub-Form */
                <div className="space-y-3 pt-1 border-t border-rose-200">
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 font-semibold">
                    Flagging non-compliance will revert this ticket back to Stage 2 (Tender Sourcing) with your instructions.
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Select Rejection Reason:</label>
                    <select
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900"
                    >
                      <option value="Substandard OEM Specifications / Wrong Model">Substandard OEM Specifications / Wrong Model</option>
                      <option value="Delivery Lead Time Too Slow (Exceeds Project Milestone)">Delivery Lead Time Too Slow (Exceeds Project Milestone)</option>
                      <option value="Inadequate Warranty / Missing 24-Month SLA">Inadequate Warranty / Missing 24-Month SLA</option>
                      <option value="Alternative Certified Brand Required">Alternative Certified Brand Required</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Engineering Feedback for Procurement Team:</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Model Cisco Catalyst 9300-48P requested with dual PSU. Quote 2 contains single PSU..."
                      value={rejectNotes}
                      onChange={(e) => setRejectNotes(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsRejectMode(false)}
                      className="px-3 py-1.5 text-slate-600 font-bold hover:bg-slate-100 rounded-lg cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExecuteFlagRejection(selectedReviewReq.ticketId || selectedReviewReq._id)}
                      disabled={actionLoading}
                      className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl font-bold shadow-xs transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Confirm Rejection & Revert</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Historical Approvals Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900">Technical Review History</h3>
          <p className="text-xs text-slate-500">Recently evaluated and approved engineering specifications</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="corp-table-header">
              <tr>
                <th className="p-3.5">Ticket ID</th>
                <th className="p-3.5">Item Description</th>
                <th className="p-3.5">Approved Supplier</th>
                <th className="p-3.5">Technical Compliance</th>
                <th className="p-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {approvedHistory.map((req) => {
                const quote = req.quotations?.find((q) => q.isChosen) || req.quotations?.[0];
                const targetUrl = `/procurement/request/${req.ticketId || req._id}`;
                return (
                  <tr key={req._id || req.ticketId} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-bold text-blue-700">{req.ticketId}</td>
                    <td className="p-3.5 font-bold text-slate-900">{req.itemDetails?.name}</td>
                    <td className="p-3.5 font-semibold text-slate-800">{quote?.vendorName || 'Selected Vendor'}</td>
                    <td className="p-3.5">
                      <span className="badge-success text-[11px]">✓ Specs Approved</span>
                    </td>
                    <td className="p-3.5 text-right">
                      <Link href={targetUrl} className="text-xs text-blue-700 font-bold hover:underline">
                        View &rarr;
                      </Link>
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
