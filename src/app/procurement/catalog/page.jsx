'use client';
import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  TrendingDown,
  Clock,
  Building2,
  Search,
  Tag,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function CatalogPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/v1/catalog')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setItems(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filtered = items.filter((item) =>
    item.itemName?.toLowerCase().includes(search.toLowerCase()) ||
    item.category?.toLowerCase().includes(search.toLowerCase()) ||
    item.preferredVendor?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
            <BookOpen className="w-6 h-6 mr-2 text-blue-700" />
            Material Catalog & Price Baselines Database
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Historical benchmark pricing database used by Finance to validate tender bids and prevent procurement overcharges.
          </p>
        </div>

        <div className="badge-primary font-bold">
          {items.length} Benchmarked Item Profiles
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search Standard Material Name, Category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="corp-table-header">
              <tr>
                <th className="p-3.5">Item Description</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Standard Unit</th>
                <th className="p-3.5">Historical Average Price</th>
                <th className="p-3.5">Last Purchased Price</th>
                <th className="p-3.5">Standard Lead Time</th>
                <th className="p-3.5">Preferred Benchmark Supplier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filtered.map((b) => (
                <tr key={b._id || b.itemName} className="hover:bg-blue-50/40 transition">
                  <td className="p-3.5 font-bold text-slate-900 text-sm">
                    {b.itemName}
                  </td>

                  <td className="p-3.5">
                    <span className="badge-primary text-[11px] font-semibold">{b.category}</span>
                  </td>

                  <td className="p-3.5 font-semibold text-slate-700">
                    {b.unit || 'Units'}
                  </td>

                  <td className="p-3.5 font-extrabold text-blue-800 text-sm">
                    {b.historicalAveragePrice?.toLocaleString()} SAR
                  </td>

                  <td className="p-3.5 font-bold text-slate-800 text-sm">
                    {b.lastPurchasedPrice?.toLocaleString()} SAR
                  </td>

                  <td className="p-3.5 font-semibold text-slate-700">
                    <div className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      <span>{b.standardLeadTimeDays || 3} Days</span>
                    </div>
                  </td>

                  <td className="p-3.5 font-semibold text-slate-800">
                    <div className="flex items-center space-x-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{b.preferredVendor}</span>
                    </div>
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
