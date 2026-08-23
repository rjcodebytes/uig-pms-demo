import React from 'react';
import Link from 'next/link';
import { ArrowRight, Box } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-40 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-40 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 p-6 md:p-12 text-center max-w-2xl w-full">
        <div className="glass-panel rounded-3xl p-10 md:p-14 shadow-2xl transition-all duration-500 hover:shadow-indigo-500/10">
          
          <div className="mb-8 flex justify-center">
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
              <Box className="w-12 h-12 text-indigo-400" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
            UIG <span className="text-gradient">Procurement</span>
          </h1>
          <p className="text-zinc-400 font-medium tracking-wide uppercase text-sm mb-6 flex items-center justify-center space-x-2">
            <span>Powered by</span>
            <span className="font-bold text-white bg-white/10 px-3 py-1 rounded-full border border-white/10">OneWebbers</span>
          </p>
          
          <p className="text-zinc-400 leading-relaxed mb-10 text-lg">
            Experience next-generation project lifecycle management. Intelligent routing, multi-stage financial compliance, and real-time vendor analytics—built exclusively for the KSA corporate market.
          </p>

          <Link href="/procurement/dashboard" className="group relative inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 font-bold text-white transition-all duration-200 bg-indigo-600 font-pj rounded-xl hover:bg-indigo-500 glow-border hover:shadow-lg hover:shadow-indigo-500/50">
            Enter Dashboard
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
