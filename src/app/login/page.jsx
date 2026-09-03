'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Building2,
  Check
} from 'lucide-react';

export default function LoginPage() {
  const [form, setForm] = useState({ username: 'admin', password: 'password123' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const quickUsers = [
    { label: 'System Admin', username: 'admin', role: 'IT Admin', icon: '⚡' },
    { label: 'Site Engineer', username: 'initiator', role: 'Site Lead', icon: '👷' },
    { label: 'Technical HOD', username: 'approver', role: 'Approver', icon: '📑' },
    { label: 'Finance Controller', username: 'storeincharge', role: 'Finance', icon: '💼' },
    { label: 'Storekeeper', username: 'storekeeper', role: 'Warehouse', icon: '📦' },
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await signIn('credentials', {
      username: form.username,
      password: form.password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError('Invalid username or password credentials.');
    } else {
      router.push('/procurement/dashboard');
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 p-4">
      
      <div className="max-w-md w-full">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-700 text-white font-black flex items-center justify-center text-xl shadow-sm mx-auto mb-3">
              U
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              UIG <span className="text-blue-700">Procurement</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">Enterprise Procurement & Lifecycle System (KSA)</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  id="username"
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  placeholder="Enter username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  id="password"
                  type="password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition flex items-center justify-center space-x-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick 1-Click Role Switcher */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center space-x-1 text-[11px] font-bold text-slate-500 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Quick Test Role Credentials (PW: password123):</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {quickUsers.map((u) => (
                <button
                  key={u.username}
                  type="button"
                  onClick={() => setForm({ username: u.username, password: 'password123' })}
                  className={`text-left p-2 rounded-xl border text-xs transition cursor-pointer ${
                    form.username === u.username
                      ? 'bg-blue-50 border-blue-600 text-blue-800 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-1.5">
                    <span>{u.icon}</span>
                    <div>
                      <div className="font-bold leading-tight">{u.label}</div>
                      <div className="text-[10px] text-slate-400">{u.role}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center mt-6">
            <Link href="/procurement/dashboard" className="text-xs text-blue-700 font-semibold hover:underline">
              ← Skip to Procurement Hub Demo
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
