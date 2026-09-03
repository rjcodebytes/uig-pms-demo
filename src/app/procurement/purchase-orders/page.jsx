'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileCheck2,
  Building2,
  MapPin,
  Search,
  Printer,
  ChevronRight,
  Receipt,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/v1/purchase-orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setOrders(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filtered = orders.filter((o) =>
    o.poNumber?.toLowerCase().includes(search.toLowerCase()) ||
    o.vendorName?.toLowerCase().includes(search.toLowerCase()) ||
    o.projectName?.toLowerCase().includes(search.toLowerCase()) ||
    o.ticketId?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPOAmount = orders.reduce((sum, o) => sum + (o.totalAmountSAR || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header & KPI */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
            <FileCheck2 className="w-6 h-6 mr-2 text-blue-700" />
            Purchase Orders (PO) Registry
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Centralized register of all authorized, legally binding POs dispatched to KSA suppliers.
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2">
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase">Total Dispatched POs Value</div>
            <div className="text-lg font-black text-blue-900">{totalPOAmount.toLocaleString()} SAR</div>
          </div>
          <span className="badge-primary font-bold">{orders.length} Active POs</span>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search PO Number, Vendor, Project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="corp-table-header">
              <tr>
                <th className="p-3.5">PO Reference</th>
                <th className="p-3.5">PR Ticket</th>
                <th className="p-3.5">Awarded Supplier</th>
                <th className="p-3.5">Project & Location</th>
                <th className="p-3.5">Total Amount (SAR)</th>
                <th className="p-3.5">Fulfillment Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filtered.map((po) => (
                <tr key={po._id} className="hover:bg-blue-50/40 transition">
                  <td className="p-3.5 font-bold text-blue-700">
                    <div className="font-extrabold text-sm">{po.poNumber}</div>
                    <div className="text-[10px] text-slate-400 font-medium">Issued: {new Date(po.generatedAt).toLocaleDateString()}</div>
                  </td>

                  <td className="p-3.5 font-bold text-slate-900">
                    <Link href={`/procurement/request/${po._id}`} className="hover:underline text-blue-600">
                      {po.ticketId}
                    </Link>
                  </td>

                  <td className="p-3.5 font-semibold text-slate-800">
                    <div className="flex items-center space-x-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{po.vendorName}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 pl-5">{po.paymentTerms}</div>
                  </td>

                  <td className="p-3.5">
                    <div className="font-semibold text-slate-800">{po.projectName}</div>
                    <div className="text-[10px] text-slate-400 flex items-center mt-0.5">
                      <MapPin className="w-3 h-3 mr-1 text-blue-600" /> {po.location}
                    </div>
                  </td>

                  <td className="p-3.5 font-black text-slate-900 text-sm">
                    {po.totalAmountSAR?.toLocaleString()} SAR
                  </td>

                  <td className="p-3.5">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      po.status === 'Completed' ? 'badge-success' :
                      po.status === 'Delivery_Pending' ? 'badge-primary' :
                      'badge-warning'
                    }`}>
                      ● {po.status.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td className="p-3.5 text-right">
                    <Link
                      href={`/procurement/request/${po._id}`}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-700 hover:text-white rounded-lg text-xs font-bold transition cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>View PO</span>
                    </Link>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400 text-sm">
                    No purchase orders found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
