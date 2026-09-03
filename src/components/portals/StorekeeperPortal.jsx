'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  PackageCheck,
  Truck,
  Building2,
  FileCheck2,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Check,
  X
} from 'lucide-react';

export default function StorekeeperPortal({ requests = [] }) {
  const [localRequests, setLocalRequests] = useState(requests);
  const [selectedInspectReq, setSelectedInspectReq] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  React.useEffect(() => {
    setLocalRequests(requests);
  }, [requests]);

  const awaitingInspection = localRequests.filter((r) => r.status === 'PO_Generated' && !r.deliveryConfirmation?.receivedAt);
  const inFinanceMatching = localRequests.filter((r) => r.status === 'Delivery_Pending');
  const completedDeliveries = localRequests.filter((r) => r.status === 'Completed');

  const handleConfirmGRN = async (reqId) => {
    setActionLoading(true);
    try {
      await fetch(`/api/v1/requests/${reqId}/lifecycle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'DELIVERY_CONFIRMED',
          receiverName: 'Site Warehouse Storekeeper',
          notes: 'Freight arrived on site. Quantity 100% verified with zero defect. Signed GRN note archived.',
        }),
      });

      const updated = localRequests.map((r) => {
        if (r._id === reqId || r.ticketId === reqId) {
          return {
            ...r,
            status: 'Delivery_Pending',
            deliveryConfirmation: {
              receivedAt: new Date(),
              recipientSignatureName: 'Site Warehouse Storekeeper',
              signedNoteUrl: '/docs/signed-grn-receipt.pdf'
            }
          };
        }
        return r;
      });
      setLocalRequests(updated);
      setSelectedInspectReq(null);
      setStatusMessage('✓ Physical delivery verified! Signed Goods Receipt Note (GRN) issued.');
      setTimeout(() => setStatusMessage(''), 4000);
    } catch (err) {
      console.error(err);
    }
    setActionLoading(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Storekeeper Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-emerald-900 text-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-teal-200 uppercase tracking-wider mb-1">
            <span>📦 Warehouse Inventory & Physical Goods Receiving Desk</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Storekeeper / GRN Receiving Desk</h2>
          <p className="text-xs text-teal-100/90 mt-1 max-w-xl leading-relaxed">
            Inspect inbound vendor freight shipments, verify physical quantities against purchase orders, and sign official Goods Receipt Notes (GRN).
          </p>
        </div>

        <div className="bg-white/10 border border-white/20 rounded-xl p-3 text-center shrink-0">
          <div className="text-2xl font-black">{awaitingInspection.length}</div>
          <div className="text-[10px] uppercase font-bold text-teal-200">Pending Physical GRN</div>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center shadow-xs">
          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Deliveries Action Queue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Awaiting GRN Inspection */}
        <div className="corp-card p-5 border-2 border-teal-500 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="badge-primary font-bold">Priority Receiving Action</span>
            <span className="text-xs font-bold text-teal-800">{awaitingInspection.length} Shipments</span>
          </div>
          <h3 className="font-extrabold text-slate-900 text-base">Arrived on Site — Needs Inspection & GRN</h3>
          <p className="text-xs text-slate-500 mb-3">Freight delivered to warehouse depot. Perform physical count & sign delivery note.</p>

          <div className="space-y-2">
            {awaitingInspection.map((req) => {
              const targetUrl = `/procurement/request/${req.ticketId || req._id}`;

              return (
                <div key={req._id || req.ticketId} className="bg-teal-50/70 border border-teal-200 p-3.5 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{req.ticketId} • {req.itemDetails?.name}</div>
                    <div className="text-[11px] text-teal-800 font-semibold">Qty: {req.itemDetails?.quantity} {req.itemDetails?.unit} ({req.location})</div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      href={targetUrl}
                      className="text-xs font-bold text-slate-600 hover:text-blue-700 underline mr-1"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => setSelectedInspectReq(req)}
                      className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-lg transition cursor-pointer shadow-xs"
                    >
                      Inspect & Sign &rarr;
                    </button>
                  </div>
                </div>
              );
            })}
            {awaitingInspection.length === 0 && (
              <div className="text-center py-6 text-slate-400 text-xs">No pending shipments to inspect</div>
            )}
          </div>
        </div>

        {/* Signed GRNs with Finance */}
        <div className="corp-card p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="badge-slate font-bold">With Finance</span>
            <span className="text-xs font-bold text-slate-700">{inFinanceMatching.length} GRNs Signed</span>
          </div>
          <h3 className="font-extrabold text-slate-900 text-base">GRN Signed — In 3-Way Match Queue</h3>
          <p className="text-xs text-slate-500 mb-3">Goods received on-site. Currently awaiting Finance Controller wire payment release.</p>

          <div className="space-y-2">
            {inFinanceMatching.map((req) => {
              const targetUrl = `/procurement/request/${req.ticketId || req._id}`;

              return (
                <div key={req._id || req.ticketId} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{req.ticketId} • {req.itemDetails?.name}</div>
                    <div className="text-[11px] text-emerald-700 font-semibold">✓ GRN Signed ({req.deliveryConfirmation?.recipientSignatureName || 'Site Receiver'})</div>
                  </div>
                  <Link
                    href={targetUrl}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition"
                  >
                    View Status &rarr;
                  </Link>
                </div>
              );
            })}
            {inFinanceMatching.length === 0 && (
              <div className="text-center py-6 text-slate-400 text-xs">No GRNs currently in finance review</div>
            )}
          </div>
        </div>

      </div>

      {/* Quick Inspection Modal */}
      {selectedInspectReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-xl w-full shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <div className="badge-primary text-[10px] font-bold mb-1">Physical Receiving & GRN Gate</div>
                <h3 className="text-base font-black text-slate-900">
                  Goods Receipt Sign-off: {selectedInspectReq.ticketId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInspectReq(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5">
                <div className="font-bold text-slate-900 text-sm">{selectedInspectReq.itemDetails?.name}</div>
                <div className="text-slate-600">Expected Quantity: <strong className="text-slate-900">{selectedInspectReq.itemDetails?.quantity} {selectedInspectReq.itemDetails?.unit || 'Units'}</strong></div>
                <div className="text-slate-600">Site Warehouse: <strong className="text-blue-700">{selectedInspectReq.location} Depot</strong></div>
              </div>

              <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 space-y-1.5">
                <div className="font-bold uppercase tracking-wider text-[10px]">Quality Inspection Checklist:</div>
                <div className="flex items-center"><Check className="w-3.5 h-3.5 mr-2 text-emerald-600" /> Physical quantity matches PO slip</div>
                <div className="flex items-center"><Check className="w-3.5 h-3.5 mr-2 text-emerald-600" /> Zero damage or transit defects observed</div>
                <div className="flex items-center"><Check className="w-3.5 h-3.5 mr-2 text-emerald-600" /> Manufacturer warranty labels verified</div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedInspectReq(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmGRN(selectedInspectReq.ticketId || selectedInspectReq._id)}
                  disabled={actionLoading}
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold shadow-xs transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Truck className="w-4 h-4" />
                  <span>{actionLoading ? 'Signing GRN...' : 'Sign GRN & Confirm Receiving'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completed Receipts History */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900">Signed Goods Receipt Notes (GRN) Archive</h3>
          <p className="text-xs text-slate-500">Physical receiving log verified with zero defects</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="corp-table-header">
              <tr>
                <th className="p-3.5">PR Ticket</th>
                <th className="p-3.5">Delivered Material</th>
                <th className="p-3.5">Quantity Inspected</th>
                <th className="p-3.5">Receiver Signature</th>
                <th className="p-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {completedDeliveries.map((req) => {
                const targetUrl = `/procurement/request/${req.ticketId || req._id}`;
                return (
                  <tr key={req._id || req.ticketId} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-bold text-blue-700">
                      <Link href={targetUrl} className="hover:underline">
                        {req.ticketId}
                      </Link>
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">{req.itemDetails?.name}</td>
                    <td className="p-3.5 font-bold text-slate-800">{req.itemDetails?.quantity} {req.itemDetails?.unit}</td>
                    <td className="p-3.5 font-semibold text-slate-800">{req.deliveryConfirmation?.recipientSignatureName || 'Site Receiver'}</td>
                    <td className="p-3.5 text-right">
                      <span className="badge-success">✓ 100% Inspected</span>
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
