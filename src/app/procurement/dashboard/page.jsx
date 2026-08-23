'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, MapPin, Search, Filter, Plus, ChevronRight } from 'lucide-react';

export default function ProcurementDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For demo purposes, we will pass role=Management to fetch all pipelines
    fetch('/api/v1/requests?role=Management')
      .then(res => res.json())
      .then(data => {
        if (data.success) setRequests(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getStatusBadge = (status) => {
    const map = {
      'Incoming': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      'Quotation_Collection': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      'Technical_Approval': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      'Finance_Review': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      'PO_Generated': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      'Delivery_Pending': 'bg-teal-500/10 text-teal-400 border-teal-500/20',
      'Completed': 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
      'Rejected_Job': 'bg-red-500/10 text-red-400 border-red-500/20'
    };
    return map[status] || 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      
      {/* Abstract Background Elements */}
      <div className="fixed top-0 inset-x-0 h-64 bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center">
              <span className="w-2 h-8 bg-indigo-500 rounded-full mr-3 glow-border"></span>
              Procurement Hub
            </h1>
            <p className="text-sm text-zinc-400 mt-2">KSA Corporate Operations • Live Pipeline</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Link href="/procurement/analytics" className="inline-flex items-center px-4 py-2 border border-white/10 shadow-sm text-sm font-medium rounded-lg text-zinc-300 bg-zinc-900/50 hover:bg-zinc-800 hover:text-white transition backdrop-blur-md">
              View Analytics
            </Link>
            <Link href="/procurement/request/new" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-500 transition glow-border">
              <Plus className="w-4 h-4 mr-2" /> New Request
            </Link>
          </div>
        </div>

        {/* Toolbar */}
        <div className="glass-panel p-4 rounded-xl mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search ticket ID or project..." 
              className="pl-10 pr-4 py-2 w-full bg-zinc-900/50 text-white border-white/10 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border transition placeholder-zinc-500"
            />
          </div>
          <button className="inline-flex items-center px-4 py-2 text-sm text-zinc-300 bg-zinc-900/50 border border-white/10 rounded-lg hover:bg-zinc-800 w-full md:w-auto justify-center transition">
            <Filter className="w-4 h-4 mr-2" /> Filters
          </button>
        </div>

        {/* Pipeline List */}
        {loading ? (
          <div className="text-center py-12 text-zinc-500 animate-pulse">Loading Pipeline...</div>
        ) : (
          <div className="space-y-4">
            {requests.map(req => (
              <Link href={`/procurement/request/${req._id}`} key={req._id} className="block">
                <div className="glass-card rounded-xl p-5 flex items-center justify-between group cursor-pointer hover:bg-zinc-900/80 transition-all">
                  
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="flex-shrink-0 bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20 group-hover:bg-indigo-500/30 transition">
                      <FileText className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div className="min-w-0 flex-1 px-5 md:grid md:grid-cols-3 md:gap-4">
                      <div>
                        <p className="text-sm font-bold text-white truncate">{req.ticketId}</p>
                        <p className="mt-1 flex items-center text-sm text-zinc-400">
                          <span className="truncate">{req.itemDetails.name} <span className="text-zinc-500 ml-1">x{req.itemDetails.quantity}</span></span>
                        </p>
                      </div>
                      <div className="hidden md:block">
                        <p className="text-sm text-zinc-300 truncate">{req.project.projectName}</p>
                        <p className="mt-1 flex items-center text-sm text-zinc-500">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-zinc-600" /> {req.location}
                        </p>
                      </div>
                      <div className="hidden md:flex items-center">
                        <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full border ${getStatusBadge(req.status)}`}>
                          {req.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <button className="text-zinc-500 hover:text-indigo-400 p-2 transition">
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 group-hover:text-indigo-400 transition-all" />
                    </button>
                  </div>

                </div>
              </Link>
            ))}
            {requests.length === 0 && (
              <div className="p-12 text-center text-zinc-500 glass-card rounded-xl">No procurement requests found in your region.</div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
