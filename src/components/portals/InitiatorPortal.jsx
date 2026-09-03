'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  PlusCircle,
  MessageSquare,
  Package,
  Clock,
  CheckCircle2,
  FileText,
  Truck,
  ArrowRight,
  AlertCircle,
  Building2,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function InitiatorPortal({ requests = [] }) {
  // Filter for requests belonging to the initiator
  const myRequests = requests.filter(
    (r) =>
      r.requester?.name?.toLowerCase().includes('mohammed') ||
      r.status === 'Incoming' ||
      r.status === 'Quotation_Collection' ||
      r.status === 'Delivery_Pending'
  );

  const pendingQuoteSelection = myRequests.filter((r) => r.status === 'Quotation_Collection');
  const awaitingDelivery = myRequests.filter((r) => r.status === 'Delivery_Pending');
  const inSourcing = myRequests.filter((r) => r.status === 'Incoming' || r.status === 'Technical_Approval' || r.status === 'Finance_Review' || r.status === 'PO_Generated');
  const completed = myRequests.filter((r) => r.status === 'Completed');

  return (
    <div className="space-y-6">
      
      {/* Site Engineer Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-200 uppercase tracking-wider mb-1">
            <span>👷 Field Operations & Engineering Portal</span>
            <span>•</span>
            <span>Riyadh Metro & Regional Projects</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Welcome, Eng. Mohammed Al-Saud</h2>
          <p className="text-xs text-blue-100/90 mt-1 max-w-xl leading-relaxed">
            Create site material requisitions, track procurement sourcing from the local desk, review vendor quotations, and sign off on site deliveries (GRN).
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <Link
            href="/procurement/request/new"
            className="px-5 py-3 bg-white hover:bg-slate-100 text-blue-800 rounded-xl text-xs font-black shadow-md transition flex items-center space-x-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-blue-700" />
            <span>+ Create New Site Requisition</span>
          </Link>
        </div>
      </div>

      {/* Actions Required By Me Alerts */}
      {(pendingQuoteSelection.length > 0 || awaitingDelivery.length > 0) && (
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">⚡ Actions Awaiting Your Input:</div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {pendingQuoteSelection.map((req) => (
              <div key={req._id || req.ticketId} className="bg-amber-50/80 border-2 border-amber-300 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="badge-warning text-[10px] font-bold">Quotation Review Ready</span>
                  <h4 className="font-extrabold text-slate-900 text-sm mt-1">{req.itemDetails?.name}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">3 vendor quotations uploaded by procurement for your review.</p>
                </div>
                <Link
                  href={`/procurement/request/${req.ticketId || req._id}`}
                  className="px-3.5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-bold transition shrink-0 ml-3 shadow-xs"
                >
                  Review Bids &rarr;
                </Link>
              </div>
            ))}

            {awaitingDelivery.map((req) => (
              <div key={req._id || req.ticketId} className="bg-teal-50/80 border-2 border-teal-300 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="badge-primary text-[10px] font-bold">Physical Delivery Arrived</span>
                  <h4 className="font-extrabold text-slate-900 text-sm mt-1">{req.itemDetails?.name}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Vendor delivered goods to site. Please inspect & sign GRN.</p>
                </div>
                <Link
                  href={`/procurement/request/${req.ticketId || req._id}`}
                  className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition shrink-0 ml-3 shadow-xs"
                >
                  Sign GRN &rarr;
                </Link>
              </div>
            ))}

          </div>
        </div>
      )}

      {/* Initiator Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="corp-card p-4">
          <div className="text-[11px] font-bold text-slate-400 uppercase">My Total PRs</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{myRequests.length}</div>
          <div className="text-[11px] text-blue-700 font-semibold mt-0.5">Active & Historical</div>
        </div>

        <div className="corp-card p-4">
          <div className="text-[11px] font-bold text-amber-700 uppercase">In Sourcing / Tender</div>
          <div className="text-2xl font-black text-amber-900 mt-1">{inSourcing.length}</div>
          <div className="text-[11px] text-amber-700 font-semibold mt-0.5">With Procurement Desk</div>
        </div>

        <div className="corp-card p-4">
          <div className="text-[11px] font-bold text-teal-700 uppercase">Arriving / Inspecting</div>
          <div className="text-2xl font-black text-teal-900 mt-1">{awaitingDelivery.length}</div>
          <div className="text-[11px] text-teal-700 font-semibold mt-0.5">On-site Delivery Note</div>
        </div>

        <div className="corp-card p-4">
          <div className="text-[11px] font-bold text-emerald-700 uppercase">Received & Closed</div>
          <div className="text-2xl font-black text-emerald-900 mt-1">{completed.length}</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">100% Fulfilled</div>
        </div>
      </div>

      {/* My Requisitions Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">My Active Site Requisitions</h3>
            <p className="text-xs text-slate-500">Real-time status of materials requested for your project sites</p>
          </div>
          <Link
            href="/procurement/request/new"
            className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center"
          >
            <MessageSquare className="w-3.5 h-3.5 mr-1" />
            <span>Use WhatsApp Simulator &rarr;</span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="corp-table-header">
              <tr>
                <th className="p-3.5">Ticket ID</th>
                <th className="p-3.5">Item Description</th>
                <th className="p-3.5">Quantity</th>
                <th className="p-3.5">Project / Site</th>
                <th className="p-3.5">Current Status</th>
                <th className="p-3.5">Assigned Officer</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {myRequests.map((req) => (
                <tr key={req._id || req.ticketId} className="hover:bg-blue-50/40 transition">
                  <td className="p-3.5 font-bold text-blue-700">
                    <Link href={`/procurement/request/${req.ticketId || req._id}`} className="hover:underline">
                      {req.ticketId}
                    </Link>
                  </td>

                  <td className="p-3.5 font-bold text-slate-900">
                    {req.itemDetails?.name}
                    <div className="text-[10px] text-slate-400 font-normal">{req.itemDetails?.category}</div>
                  </td>

                  <td className="p-3.5 font-bold text-slate-800">
                    {req.itemDetails?.quantity} {req.itemDetails?.unit || 'Units'}
                  </td>

                  <td className="p-3.5">
                    <div className="font-semibold text-slate-800">{req.project?.projectName}</div>
                    <div className="text-[10px] text-slate-400">{req.location}</div>
                  </td>

                  <td className="p-3.5">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      req.status === 'Completed' ? 'badge-success' :
                      req.status === 'Quotation_Collection' ? 'badge-warning' :
                      req.status === 'Delivery_Pending' ? 'badge-primary' :
                      'badge-slate'
                    }`}>
                      ● {req.status.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td className="p-3.5 text-slate-600 font-medium">
                    {req.assignedTo?.officer || 'Tariq Al-Mansoor'}
                  </td>

                  <td className="p-3.5 text-right">
                    <Link
                      href={`/procurement/request/${req.ticketId || req._id}`}
                      className="inline-flex items-center px-3 py-1 bg-slate-100 hover:bg-blue-700 hover:text-white rounded-lg text-xs font-bold transition"
                    >
                      <span>View &rarr;</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
