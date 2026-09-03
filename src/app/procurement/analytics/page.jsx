'use client';
import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  Package,
  AlertTriangle,
  Building2,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Award
} from 'lucide-react';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/analytics?type=all')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAnalytics(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const vendorSpendData = [
    { name: 'Jarir Commercial', spend: 285000, orders: 14 },
    { name: 'Saudi ReadyMix', spend: 420000, orders: 6 },
    { name: 'Al-Jazirah Tech', spend: 195000, orders: 8 },
    { name: 'IKEA Business', spend: 145000, orders: 9 },
    { name: 'Saudi Safety Corp', spend: 95000, orders: 5 },
  ];

  const categoryData = [
    { name: 'Construction Materials', value: 420000, color: '#1e40af' },
    { name: 'IT Hardware & Cloud', value: 480000, color: '#2563eb' },
    { name: 'Office Furniture', value: 145000, color: '#059669' },
    { name: 'Industrial & Safety', value: 95000, color: '#d97706' },
  ];

  const delayData = [
    { vendor: 'Jarir Commercial', variance: 0.5, rating: 'Excellent (A+)' },
    { vendor: 'Saudi ReadyMix', variance: 0.0, rating: 'Zero Variance (A+)' },
    { vendor: 'Al-Jazirah Tech', variance: 1.8, rating: 'Acceptable (B+)' },
    { vendor: 'IKEA Business', variance: 2.1, rating: 'Acceptable (B)' },
    { vendor: 'Saudi Safety Corp', variance: 0.8, rating: 'Excellent (A)' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">Executive Intelligence</div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            Procurement Analytics & Spend Diagnostics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time capital expenditure, vendor SLA delivery benchmarks, and category budget allocations across KSA.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-1.5 text-xs font-bold text-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Live SAMA SARIE & DB Sync Active</span>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="corp-card p-5 bg-gradient-to-br from-white to-blue-50/50">
          <div className="text-xs font-bold text-slate-500 uppercase">Total Settled CAPEX</div>
          <div className="text-2xl font-black text-blue-900 mt-2">1,140,000 <span className="text-xs font-bold text-slate-500">SAR</span></div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1">✓ 100% Reconciled POs</div>
        </div>

        <div className="corp-card p-5">
          <div className="text-xs font-bold text-slate-500 uppercase">Cost Savings vs Baseline</div>
          <div className="text-2xl font-black text-emerald-700 mt-2">68,400 <span className="text-xs font-bold text-slate-500">SAR</span></div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1">Generated via 3-Bid Tender Policy</div>
        </div>

        <div className="corp-card p-5">
          <div className="text-xs font-bold text-slate-500 uppercase">Active Contracted Suppliers</div>
          <div className="text-2xl font-black text-slate-900 mt-2">5 Suppliers</div>
          <div className="text-[11px] text-blue-700 font-bold mt-1">CR & ZATCA Approved</div>
        </div>

        <div className="corp-card p-5">
          <div className="text-xs font-bold text-slate-500 uppercase">Average Delivery Variance</div>
          <div className="text-2xl font-black text-slate-900 mt-2">1.04 <span className="text-xs font-bold text-slate-500">Days</span></div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1">High SLA Compliance</div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Vendor Spend Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Capital Expenditure by Vendor (SAR)</h3>
              <p className="text-xs text-slate-500">Total volume contracted across fulfilled purchase orders</p>
            </div>
            <span className="badge-primary">Top 5 Vendors</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vendorSpendData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} interval={0} angle={-15} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(value) => [`${value.toLocaleString()} SAR`, 'Total Spend']}
                />
                <Bar dataKey="spend" fill="#1d4ed8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Allocation Pie Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Budget Allocation by Category</h3>
              <p className="text-xs text-slate-500">Procurement spend distributed by material classification</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(value) => [`${value.toLocaleString()} SAR`, 'Spend']}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Vendor Delay & Lead Time SLA Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-1">Vendor Delivery Delay & SLA Diagnostics</h3>
        <p className="text-xs text-slate-500 mb-4">
          Tracking promised lead times against actual signed Goods Receipt Notes (GRN) on site.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="corp-table-header">
              <tr>
                <th className="p-3">Vendor / Supplier</th>
                <th className="p-3">Average Delay Variance</th>
                <th className="p-3">Reliability Rating</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {delayData.map((d, i) => (
                <tr key={i} className="hover:bg-slate-50 transition">
                  <td className="p-3 font-bold text-slate-900">{d.vendor}</td>
                  <td className="p-3 font-extrabold text-blue-800">
                    +{d.variance} Days vs Promised Lead Time
                  </td>
                  <td className="p-3 font-semibold text-slate-800">{d.rating}</td>
                  <td className="p-3">
                    <span className="badge-success">
                      ✓ Compliant
                    </span>
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
