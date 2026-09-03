'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, signIn } from 'next-auth/react';
import {
  LayoutDashboard,
  FileCheck2,
  Building2,
  BookOpen,
  BarChart3,
  PlusCircle,
  LogOut,
  ShieldCheck,
  UserCheck,
  MapPin,
  ChevronDown,
  Sparkles,
  Users,
  CheckSquare,
  PackageCheck,
  Receipt
} from 'lucide-react';

export default function Navbar({ user }) {
  const pathname = usePathname();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const userRole = user?.role || 'Admin';

  // Role-specific tailored navigation tabs
  const getNavLinks = (role) => {
    switch (role) {
      case 'Initiator':
        return [
          { href: '/procurement/dashboard', label: 'My Requisitions', icon: LayoutDashboard },
          { href: '/procurement/request/new', label: '+ New Requisition', icon: PlusCircle },
          { href: '/procurement/catalog', label: 'Price Baselines', icon: BookOpen },
        ];
      case 'Approver':
        return [
          { href: '/procurement/dashboard', label: 'Technical Approvals Queue', icon: CheckSquare },
          { href: '/procurement/vendors', label: 'Approved Suppliers', icon: Building2 },
          { href: '/procurement/catalog', label: 'Price Baselines', icon: BookOpen },
        ];
      case 'Store Incharge': // Finance role in demo
        return [
          { href: '/procurement/dashboard', label: 'Finance Review & Settlement', icon: Receipt },
          { href: '/procurement/purchase-orders', label: 'Purchase Orders (POs)', icon: FileCheck2 },
          { href: '/procurement/catalog', label: 'Price Baselines', icon: BookOpen },
          { href: '/procurement/analytics', label: 'Spend Analytics', icon: BarChart3 },
        ];
      case 'Store Keeper':
        return [
          { href: '/procurement/dashboard', label: 'Goods Receiving (GRN)', icon: PackageCheck },
          { href: '/procurement/purchase-orders', label: 'Incoming Dispatched POs', icon: FileCheck2 },
          { href: '/procurement/vendors', label: 'Suppliers Directory', icon: Building2 },
        ];
      default: // Admin
        return [
          { href: '/procurement/dashboard', label: 'Master Pipeline', icon: LayoutDashboard },
          { href: '/procurement/purchase-orders', label: 'Purchase Orders', icon: FileCheck2 },
          { href: '/procurement/vendors', label: 'Suppliers', icon: Building2 },
          { href: '/procurement/catalog', label: 'Price Baselines', icon: BookOpen },
          { href: '/procurement/analytics', label: 'Spend Analytics', icon: BarChart3 },
        ];
    }
  };

  const navLinks = getNavLinks(userRole);

  const testRoles = [
    { username: 'admin', label: 'System Admin (Master View)', role: 'Admin', desc: 'All KSA location pipelines & full admin controls', icon: '⚡' },
    { username: 'initiator', label: 'Site Engineer (Eng. Mohammed)', role: 'Initiator', desc: 'Creates requisitions & tracks site goods', icon: '👷' },
    { username: 'approver', label: 'Technical Approver / HOD', role: 'Approver', desc: 'Reviews 3-bid tenders & engineering specs', icon: '📑' },
    { username: 'storeincharge', label: 'Finance Controller & Commercial Lead', role: 'Finance', desc: 'Price baseline variance, budget & 3-way payment', icon: '💼' },
    { username: 'storekeeper', label: 'Warehouse Receiver & Storekeeper', role: 'Store Keeper', desc: 'Inspects site delivery & signs GRN receipt note', icon: '📦' },
  ];

  const handleSwitchRole = async (username) => {
    setRoleMenuOpen(false);
    await signIn('credentials', {
      username,
      password: 'password123',
      redirect: false,
    });
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      
      {/* Top Banner with Active Desk Indicator & Live Switcher */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-slate-200">
            Active Role: <span className="text-blue-400 font-bold">{user?.name || 'System Admin'}</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 hidden sm:inline-block">
            {userRole === 'Initiator' ? 'Site Requisitions & Material Ingestion Portal' :
             userRole === 'Approver' ? 'Technical Specification Review Desk' :
             userRole === 'Store Incharge' ? 'Finance Controller & Commercial Compliance Center' :
             userRole === 'Store Keeper' ? 'Warehouse & Site Goods Receiving (GRN) Desk' :
             'Executive Management Oversight (All KSA Desks)'}
          </span>
        </div>

        {/* Live Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center space-x-1.5 bg-blue-900/60 hover:bg-blue-800 text-blue-200 px-2.5 py-1 rounded-md text-[11px] font-bold border border-blue-700 transition cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Switch Role Test View: </span>
            <span className="text-white font-black underline ml-0.5">
              {userRole === 'Store Incharge' ? 'Finance Controller' : userRole}
            </span>
            <ChevronDown className="w-3 h-3 text-blue-300 ml-1" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-72 bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3.5 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Select Department Role Perspective:
              </div>
              {testRoles.map((r) => (
                <button
                  key={r.username}
                  onClick={() => handleSwitchRole(r.username)}
                  className={`w-full text-left px-3.5 py-2.5 text-xs flex items-start justify-between hover:bg-blue-50 transition cursor-pointer ${
                    user?.username === r.username ? 'bg-blue-50 font-bold text-blue-700' : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <span className="text-base">{r.icon}</span>
                    <div>
                      <div className="font-bold leading-tight text-slate-900">{r.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{r.desc}</div>
                    </div>
                  </div>
                  {user?.username === r.username && (
                    <span className="text-[10px] bg-blue-700 text-white px-2 py-0.5 rounded-full font-bold shrink-0 mt-0.5">Active</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-8">
            <Link href="/procurement/dashboard" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 rounded-xl bg-blue-700 flex items-center justify-center font-black text-white text-lg shadow-sm shadow-blue-700/30 group-hover:bg-blue-800 transition">
                U
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-black text-slate-900 text-lg tracking-tight">UIG</span>
                  <span className="font-bold text-blue-700 text-lg tracking-tight">PMS</span>
                </div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider -mt-1">
                  {userRole === 'Store Incharge' ? 'Finance & Commercial Control' : userRole === 'Store Keeper' ? 'Warehouse & Site Receiving' : `${userRole} Workspace`}
                </div>
              </div>
            </Link>

            {/* Role-Specific Navigation Tabs */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            
            {/* Show New Request Button for Roles that create PRs */}
            {(userRole === 'Initiator' || userRole === 'Admin') && (
              <Link
                href="/procurement/request/new"
                className="inline-flex items-center space-x-1.5 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-xs transition cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ New Requisition</span>
              </Link>
            )}

            {/* User Profile Pill */}
            {user && (
              <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
                <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
                  <div className="w-7 h-7 rounded-md bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold border border-blue-200">
                    {user.name?.[0] || 'U'}
                  </div>
                  <div className="text-left hidden md:block">
                    <div className="text-xs font-bold text-slate-800 leading-tight">{user.name}</div>
                    <div className="text-[10px] font-semibold text-emerald-700 leading-tight">{userRole} Desk</div>
                  </div>
                </div>

                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer border border-transparent hover:border-rose-200"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
