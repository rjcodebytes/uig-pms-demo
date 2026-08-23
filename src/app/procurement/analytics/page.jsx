'use client';
import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, AlertTriangle, Package, Activity } from 'lucide-react';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/analytics?type=all')
      .then(res => res.json())
      .then(resData => {
        if (resData.success) {
          setData(resData.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading UIG Analytics...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">Failed to load analytics</div>;

  return (
    <div className="min-h-screen bg-zinc-950 relative">
      
      {/* Background glow */}
      <div className="fixed top-0 inset-x-0 h-96 bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6">
          <div>
            <p className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-2 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-ping"></span>
              OneWebbers Intelligence
            </p>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">UIG Procurement Analytics</h1>
            <p className="text-zinc-400 mt-2">Real-time capital expenditure and operational diagnostics for KSA.</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center glass-panel px-4 py-2 rounded-xl">
            <Activity className="w-5 h-5 text-emerald-400 mr-2" />
            <span className="text-sm font-medium text-zinc-300">Live Data Sync Active</span>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 flex items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5"><TrendingUp className="w-24 h-24" /></div>
            <div className="p-3 bg-indigo-500/20 border border-indigo-500/30 rounded-xl mr-5 z-10">
              <TrendingUp className="w-8 h-8 text-indigo-400" />
            </div>
            <div className="z-10">
              <p className="text-sm text-zinc-400 font-medium mb-1">Total Vendor Spend</p>
              <p className="text-3xl font-black text-white">
                {data.spendByVendor?.reduce((acc, curr) => acc + curr.totalSpend, 0).toLocaleString()} <span className="text-lg text-zinc-500 font-medium">SAR</span>
              </p>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6 flex items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5"><Package className="w-24 h-24" /></div>
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl mr-5 z-10">
              <Package className="w-8 h-8 text-emerald-400" />
            </div>
            <div className="z-10">
              <p className="text-sm text-zinc-400 font-medium mb-1">Items Procured</p>
              <p className="text-3xl font-black text-white">
                {data.categoryVolume?.reduce((acc, curr) => acc + curr.volume, 0).toLocaleString()} <span className="text-lg text-zinc-500 font-medium">Units</span>
              </p>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6 flex items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5"><AlertTriangle className="w-24 h-24" /></div>
            <div className="p-3 bg-amber-500/20 border border-amber-500/30 rounded-xl mr-5 z-10">
              <AlertTriangle className="w-8 h-8 text-amber-400" />
            </div>
            <div className="z-10">
              <p className="text-sm text-zinc-400 font-medium mb-1">Avg Delivery Variance</p>
              <p className="text-3xl font-black text-white">
                {data.operationalDelays?.length > 0 
                  ? (data.operationalDelays.reduce((acc, c) => acc + c.avgVarianceDays, 0) / data.operationalDelays.length).toFixed(1) 
                  : '0'} <span className="text-lg text-zinc-500 font-medium">Days</span>
              </p>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Spend By Vendor */}
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white flex items-center mb-6">
              <span className="w-2 h-6 bg-indigo-500 rounded-full mr-3 glow-border"></span>
              Capital Expenditure by Vendor
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.spendByVendor} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                  <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{fill: '#a1a1aa', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#a1a1aa', fontSize: 12}} tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip 
                    cursor={{fill: '#27272a', opacity: 0.4}}
                    contentStyle={{borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(24, 24, 27, 0.9)', backdropFilter: 'blur(8px)', color: '#fff'}}
                    itemStyle={{color: '#fff'}}
                    formatter={(value) => [`${value.toLocaleString()} SAR`, 'Total Spend']}
                  />
                  <Bar dataKey="totalSpend" fill="url(#colorIndigo)" radius={[6, 6, 0, 0]} barSize={40} />
                  <defs>
                    <linearGradient id="colorIndigo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4338ca" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Volume */}
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white flex items-center mb-6">
              <span className="w-2 h-6 bg-emerald-500 rounded-full mr-3 glow-border"></span>
              Budget Allocation by Category
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.categoryVolume}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="totalSpend"
                    nameKey="_id"
                    stroke="rgba(0,0,0,0)"
                  >
                    {data.categoryVolume?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(24, 24, 27, 0.9)', backdropFilter: 'blur(8px)', color: '#fff'}}
                    itemStyle={{color: '#fff'}}
                    formatter={(value) => [`${value.toLocaleString()} SAR`, 'Allocated']} 
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{color: '#a1a1aa', fontSize: '12px'}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Delay Diagnostics */}
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-white flex items-center mb-2">
            <span className="w-2 h-6 bg-amber-500 rounded-full mr-3 glow-border"></span>
            Operational Delay Diagnostics
          </h3>
          <p className="text-sm text-zinc-400 mb-6">Average variance (in days) between vendor promised lead time and actual received date.</p>
          
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-zinc-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Deliveries</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Avg Delay (Days)</th>
                </tr>
              </thead>
              <tbody className="bg-transparent divide-y divide-white/5">
                {data.operationalDelays?.map((delay, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-zinc-200">{delay._id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-zinc-400">{delay.deliveries}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                        delay.avgVarianceDays > 2 ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                        delay.avgVarianceDays > 0 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {delay.avgVarianceDays > 0 ? `+${delay.avgVarianceDays.toFixed(1)} Days` : `${delay.avgVarianceDays.toFixed(1)} Days`}
                      </span>
                    </td>
                  </tr>
                ))}
                {(!data.operationalDelays || data.operationalDelays.length === 0) && (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-zinc-500 italic">No delivery data available yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
