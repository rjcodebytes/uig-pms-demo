import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Building2,
  CheckCircle2,
  TrendingUp,
  Receipt,
  FileCheck2,
  MapPin,
  Clock,
  LogIn,
  MessageSquare,
  BarChart3,
  BookOpen,
  PlusCircle,
  Layers,
  Sparkles
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 flex flex-col justify-between">
      
      {/* Top Corporate Nav Header */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-700 text-white font-black flex items-center justify-center text-lg shadow-sm">
              U
            </div>
            <div>
              <span className="font-black text-slate-900 text-lg">UIG</span>
              <span className="font-bold text-blue-700 text-lg ml-1">PMS</span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Saudi Enterprise Portal
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href="/procurement/vendors"
              className="hidden md:inline-flex px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-blue-700 hover:bg-slate-100 transition"
            >
              Suppliers
            </Link>
            <Link
              href="/procurement/catalog"
              className="hidden md:inline-flex px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-blue-700 hover:bg-slate-100 transition"
            >
              Price Baselines
            </Link>
            <Link
              href="/procurement/analytics"
              className="hidden md:inline-flex px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-blue-700 hover:bg-slate-100 transition"
            >
              Analytics
            </Link>

            <Link
              href="/login"
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition flex items-center space-x-1"
            >
              <LogIn className="w-3.5 h-3.5 text-slate-500" />
              <span>Sign In / Switch Role</span>
            </Link>

            <Link
              href="/procurement/dashboard"
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white transition shadow-xs flex items-center space-x-1.5"
            >
              <span>Launch Live Pipeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 text-center space-y-8 my-auto">
        
        <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200/80 rounded-full px-3.5 py-1 text-xs font-bold text-blue-800 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Next-Generation Saudi Corporate Procurement Architecture</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
          End-to-End <span className="text-blue-700">Procurement & Lifecycle</span> Management Platform
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Unifying <strong className="text-slate-800">Operations, Technical Engineering, Finance, and Site Delivery</strong> across Riyadh, Jeddah, and Eastern Province with automated 3-bid tender analysis, historical baseline variance detection, and SAMA SARIE 3-way payment reconciliation.
        </p>

        {/* 4 Distinct Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          
          {/* Button 1: Pipeline Hub */}
          <Link
            href="/procurement/dashboard"
            className="px-6 py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition flex items-center space-x-2"
          >
            <Layers className="w-4 h-4" />
            <span>1. Pipeline Hub (Kanban)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Button 2: WhatsApp Requisition */}
          <Link
            href="/procurement/request/new"
            className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition flex items-center space-x-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>2. WhatsApp AI Requisition</span>
          </Link>

          {/* Button 3: Purchase Orders */}
          <Link
            href="/procurement/purchase-orders"
            className="px-6 py-3.5 bg-white border border-slate-300 hover:border-blue-600 hover:bg-blue-50 text-slate-800 font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-2"
          >
            <FileCheck2 className="w-4 h-4 text-blue-700" />
            <span>3. Purchase Orders (POs)</span>
          </Link>

          {/* Button 4: Role-Based Login */}
          <Link
            href="/login"
            className="px-6 py-3.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-2"
          >
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>4. Role-Based Login (5 Roles)</span>
          </Link>

        </div>

        {/* 4 Interactive Clickable Pillar Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-8 text-left">
          
          {/* Pillar 1: Regional Routing */}
          <Link
            href="/procurement/request/new"
            className="corp-card p-5 hover:border-emerald-500 hover:ring-2 hover:ring-emerald-100 group block"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs mb-3 group-hover:scale-110 transition-transform">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="font-extrabold text-slate-900 text-sm group-hover:text-emerald-700 flex items-center justify-between">
              <span>Regional Routing & WhatsApp</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Automated location queues for Riyadh, Jeddah & Eastern Province desks with WhatsApp ingestion.
            </p>
          </Link>

          {/* Pillar 2: 3-Bid Tender */}
          <Link
            href="/procurement/dashboard"
            className="corp-card p-5 hover:border-blue-500 hover:ring-2 hover:ring-blue-100 group block"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs mb-3 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="font-extrabold text-slate-900 text-sm group-hover:text-blue-700 flex items-center justify-between">
              <span>3-Bid Market Matrix</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Automated tender comparison matrix flagging lowest prices, fastest lead times, and SLA terms.
            </p>
          </Link>

          {/* Pillar 3: Price Baselines */}
          <Link
            href="/procurement/catalog"
            className="corp-card p-5 hover:border-amber-500 hover:ring-2 hover:ring-amber-100 group block"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs mb-3 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="font-extrabold text-slate-900 text-sm group-hover:text-amber-700 flex items-center justify-between">
              <span>Price Baseline Database</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Finance validation checking tender bids against historical database pricing to prevent overspend.
            </p>
          </Link>

          {/* Pillar 4: POs & Settlement */}
          <Link
            href="/procurement/purchase-orders"
            className="corp-card p-5 hover:border-purple-500 hover:ring-2 hover:ring-purple-100 group block"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs mb-3 group-hover:scale-110 transition-transform">
              <Receipt className="w-4 h-4" />
            </div>
            <div className="font-extrabold text-slate-900 text-sm group-hover:text-purple-700 flex items-center justify-between">
              <span>Purchase Orders & GRN</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Digital reconciliation across PO, signed site GRN receipt note, and SAMA SARIE wire release.
            </p>
          </Link>

        </div>

        {/* Quick Directory Links Grid */}
        <div className="bg-slate-100/80 rounded-2xl p-4 border border-slate-200 text-xs flex flex-wrap items-center justify-around gap-3 pt-3">
          <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">Direct Workspace Links:</span>
          <Link href="/procurement/dashboard" className="font-bold text-blue-700 hover:underline">📋 Pipeline Hub</Link>
          <Link href="/procurement/request/new" className="font-bold text-emerald-700 hover:underline">💬 WhatsApp Simulator</Link>
          <Link href="/procurement/purchase-orders" className="font-bold text-blue-700 hover:underline">📄 PO Registry</Link>
          <Link href="/procurement/vendors" className="font-bold text-slate-800 hover:underline">🏢 Approved Suppliers</Link>
          <Link href="/procurement/catalog" className="font-bold text-slate-800 hover:underline">📖 Price Baselines</Link>
          <Link href="/procurement/analytics" className="font-bold text-purple-700 hover:underline">📊 Spend Analytics</Link>
          <Link href="/login" className="font-bold text-amber-700 hover:underline">🔐 Test Roles (5)</Link>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>UIG Enterprise Procurement & Lifecycle Management System</span>
          <span className="text-slate-400">Powered by OneWebbers Intelligence • KSA Corporate Edition</span>
        </div>
      </footer>

    </div>
  );
}
