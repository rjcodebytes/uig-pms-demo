'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Kanban,
  Table as TableIcon,
  MapPin,
  TrendingUp,
  FileText,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function AdminMasterDashboard({ requests = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [viewMode, setViewMode] = useState('kanban');

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.ticketId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.project?.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.itemDetails?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.purchaseOrder?.poNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.requester?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRegion =
      selectedRegion === 'ALL' ||
      req.location === selectedRegion ||
      (selectedRegion === 'Eastern' && (req.location === 'Dammam' || req.location === 'Khobar'));

    const matchesStatus = selectedStatus === 'ALL' || req.status === selectedStatus;

    return matchesSearch && matchesRegion && matchesStatus;
  });

  const totalPipelineValue = requests.reduce((sum, r) => {
    const chosen = r.quotations?.find((q) => q.isChosen) || r.quotations?.[0];
    return sum + (chosen?.totalPrice || (r.itemDetails?.quantity || 1) * (r.itemDetails?.targetPrice || 200));
  }, 0);

  const pendingApprovalsCount = requests.filter(
    (r) => r.status === 'Technical_Approval' || r.status === 'Finance_Review'
  ).length;

  const completedCount = requests.filter((r) => r.status === 'Completed').length;
  const activeCount = requests.length - completedCount;

  const kanbanColumns = [
    { key: 'Incoming', label: '1. Requisition Ingested', badgeColor: 'badge-primary' },
    { key: 'Quotation_Collection', label: '2. 3-Bid Quotes Collection', badgeColor: 'badge-primary' },
    { key: 'Technical_Approval', label: '3. Technical / HOD Review', badgeColor: 'badge-warning' },
    { key: 'Finance_Review', label: '4. Finance Approval & Budget', badgeColor: 'badge-warning' },
    { key: 'PO_Generated', label: '5. PO Issued to Vendor', badgeColor: 'badge-primary' },
    { key: 'Delivery_Pending', label: '6. GRN & Site Receiving', badgeColor: 'badge-slate' },
    { key: 'Completed', label: '7. Payment Settled & Closed', badgeColor: 'badge-success' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Master KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="corp-card p-5 bg-gradient-to-br from-white to-blue-50/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Pipeline Value</span>
            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">SAR</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">{totalPipelineValue.toLocaleString()}</span>
            <span className="text-xs font-bold text-slate-500 ml-1">SAR</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" /> Across all KSA regional projects
          </div>
        </div>

        <div className="corp-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active PR Tickets</span>
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
              <FileText className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900">{activeCount} Tickets</div>
          <div className="text-[11px] text-slate-500 mt-1">Live corporate workflows</div>
        </div>

        <div className="corp-card p-5 bg-gradient-to-br from-white to-amber-50/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Pending Approvals</span>
            <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 text-2xl font-black text-amber-900">{pendingApprovalsCount} Required</div>
          <div className="text-[11px] text-amber-800 font-semibold mt-1">Technical & Finance gates</div>
        </div>

        <div className="corp-card p-5 bg-gradient-to-br from-white to-emerald-50/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Settled & Closed</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 text-2xl font-black text-emerald-900">{completedCount} Orders</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">100% 3-Way Reconciled</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search Ticket ID, PO Number, Project, Item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 w-full md:w-auto overflow-x-auto">
          {[
            { key: 'ALL', label: 'All KSA Locations' },
            { key: 'Riyadh', label: 'Riyadh' },
            { key: 'Jeddah', label: 'Jeddah' },
            { key: 'Eastern', label: 'Eastern (Dammam)' },
          ].map((reg) => (
            <button
              key={reg.key}
              onClick={() => setSelectedRegion(reg.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                selectedRegion === reg.key ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {reg.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-1 border border-slate-200 rounded-xl p-1 bg-slate-50">
          <button
            onClick={() => setViewMode('kanban')}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              viewMode === 'kanban' ? 'bg-blue-700 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Kanban className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              viewMode === 'table' ? 'bg-blue-700 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <TableIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      {viewMode === 'kanban' && (
        <div className="overflow-x-auto pb-6">
          <div className="flex items-start space-x-4 min-w-[1350px]">
            {kanbanColumns.map((col) => {
              const colTickets = filteredRequests.filter((r) => r.status === col.key);

              return (
                <div key={col.key} className="w-72 shrink-0 bg-slate-100/80 rounded-2xl p-3 border border-slate-200/80 flex flex-col max-h-[750px]">
                  <div className="flex items-center justify-between px-2 py-1.5 mb-2">
                    <span className="text-xs font-extrabold text-slate-800">{col.label}</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                      {colTickets.length}
                    </span>
                  </div>

                  <div className="space-y-3 overflow-y-auto pr-1">
                    {colTickets.map((ticket) => {
                      const quote = ticket.quotations?.find((q) => q.isChosen) || ticket.quotations?.[0];

                      return (
                        <Link
                          key={ticket._id}
                          href={`/procurement/request/${ticket._id}`}
                          className="block corp-card p-4 hover:border-blue-600 group cursor-pointer transition shadow-xs"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-extrabold text-blue-700 text-xs">{ticket.ticketId}</span>
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                              {ticket.location}
                            </span>
                          </div>

                          <div className="font-extrabold text-slate-900 text-sm leading-snug group-hover:text-blue-700 transition">
                            {ticket.itemDetails?.name}
                          </div>

                          <div className="text-xs text-slate-500 mt-1 truncate">
                            {ticket.project?.projectName}
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-800">
                              {quote?.totalPrice ? `${quote.totalPrice.toLocaleString()} SAR` : 'Pending Tender'}
                            </span>
                            <span className="text-slate-400 text-[11px] group-hover:text-blue-700 flex items-center font-semibold">
                              Open &rarr;
                            </span>
                          </div>
                        </Link>
                      );
                    })}

                    {colTickets.length === 0 && (
                      <div className="text-center py-8 text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-xl">
                        No tickets in stage
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Table Grid */}
      {viewMode === 'table' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="corp-table-header">
                <tr>
                  <th className="p-3.5">Ticket ID</th>
                  <th className="p-3.5">Item & Quantity</th>
                  <th className="p-3.5">Project & Client</th>
                  <th className="p-3.5">Region Desk</th>
                  <th className="p-3.5">Commercial Bid</th>
                  <th className="p-3.5">Pipeline Stage</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {filteredRequests.map((req) => {
                  const quote = req.quotations?.find((q) => q.isChosen) || req.quotations?.[0];

                  return (
                    <tr key={req._id} className="hover:bg-blue-50/40 transition">
                      <td className="p-3.5 font-bold text-blue-700">
                        <Link href={`/procurement/request/${req._id}`} className="hover:underline">
                          {req.ticketId}
                        </Link>
                      </td>
                      <td className="p-3.5 font-semibold text-slate-900">
                        <div className="font-bold">{req.itemDetails?.name}</div>
                        <div className="text-slate-400 text-[11px]">Qty: {req.itemDetails?.quantity} {req.itemDetails?.unit}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-800">{req.project?.projectName}</div>
                        <div className="text-slate-400 text-[10px]">{req.requester?.name}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="inline-flex items-center text-xs font-semibold text-slate-700">
                          <MapPin className="w-3 h-3 mr-1 text-blue-600" /> {req.location}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">
                        {quote?.totalPrice ? `${quote.totalPrice.toLocaleString()} SAR` : 'Pending Tender'}
                      </td>
                      <td className="p-3.5">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          req.status === 'Completed' ? 'badge-success' :
                          req.status.includes('Approval') || req.status.includes('Review') ? 'badge-warning' :
                          'badge-primary'
                        }`}>
                          {req.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <Link
                          href={`/procurement/request/${req._id}`}
                          className="inline-flex items-center space-x-1 px-3 py-1 bg-slate-100 hover:bg-blue-700 hover:text-white rounded-lg text-xs font-bold transition"
                        >
                          <span>Manage</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
