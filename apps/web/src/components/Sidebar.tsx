'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Bot,
  Phone,
  PhoneCall,
  MessageSquareText,
  Workflow,
  Blocks,
  BarChart3,
  Settings,
  Sparkles,
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Agents', href: '/agents', icon: Bot },
  { name: 'Phone Numbers', href: '/phone-numbers', icon: Phone },
  { name: 'Call History', href: '/calls', icon: PhoneCall },
  { name: 'Workflows', href: '/workflows', icon: Workflow },
  { name: 'Integrations', href: '/integrations', icon: Blocks },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0d121f] border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0">
      <div>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800/60">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-white text-base leading-none">P2D Voice AI</h1>
            <span className="text-[11px] text-slate-400">Enterprise Platform</span>
          </div>
        </div>

        <nav className="p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-violet-600/15 text-violet-400 border border-violet-500/20 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-violet-400' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800/60">
        <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-violet-300 font-bold text-xs">
            SJ
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-medium text-slate-200 truncate">Sainath Jogdand</p>
            <p className="text-[10px] text-slate-400 truncate">Pur2Divin Org (Admin)</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
