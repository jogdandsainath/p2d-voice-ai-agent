'use client';

import React from 'react';
import { Bell, Search, Activity } from 'lucide-react';

export function Navbar({ title }: { title: string }) {
  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#0d121f]/50 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-white tracking-tight">{title}</h2>
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Activity className="w-3 h-3 animate-pulse" />
          Voice Gateway Live
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search agents, calls, actions..."
            className="bg-slate-900/80 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 w-64 transition-all"
          />
        </div>

        <button className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-violet-500 absolute top-1.5 right-1.5 ring-2 ring-[#0d121f]" />
        </button>
      </div>
    </header>
  );
}
