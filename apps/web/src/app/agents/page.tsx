'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import {
  Bot,
  Plus,
  Phone,
  Play,
  CheckCircle2,
  Sparkles,
  Sliders,
  MoreVertical,
} from 'lucide-react';

const INITIAL_AGENTS = [
  {
    id: 'agent_sales_01',
    name: 'P2D Sales Qualification Agent',
    description: 'Inbound SDR agent to qualify enterprise prospects and schedule product demos.',
    status: 'Published',
    version: '1.0.0',
    voice: 'Rachel (Enterprise SDR)',
    voiceProvider: 'elevenlabs',
    phoneNumber: '+14155552671',
    callsCount: 9,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  {
    id: 'agent_outbound_01',
    name: 'P2D Outbound Lead Follow-up Agent',
    description: 'Conducts proactive follow-up calls to newly registered platform leads.',
    status: 'Published',
    version: '1.0.0',
    voice: 'Domi (Outbound Specialist)',
    voiceProvider: 'elevenlabs',
    phoneNumber: '+919876543210',
    callsCount: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
];

export default function AgentsListPage() {
  const [agents, setAgents] = useState(INITIAL_AGENTS);

  return (
    <main className="flex-1 flex flex-col">
      <Navbar title="Voice Agent Workforce" />

      <div className="p-8 space-y-6 max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Active Voice Agents</h2>
            <p className="text-xs text-slate-400">Configure personas, voice models, knowledge bases, and tools</p>
          </div>
          <Link
            href="/agents/new"
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-violet-600/30 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Agent
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-[#0d121f] border border-slate-800 rounded-2xl p-6 space-y-5 hover:border-slate-700 transition-all shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-violet-500/20"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base">{agent.name}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {agent.status} (v{agent.version})
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{agent.description}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs">
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
                  <span className="text-slate-400 block text-[10px] uppercase font-medium">Voice Model</span>
                  <span className="text-slate-200 font-semibold">{agent.voice}</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
                  <span className="text-slate-400 block text-[10px] uppercase font-medium">Assigned Phone</span>
                  <span className="text-slate-200 font-semibold">{agent.phoneNumber}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">
                  Handled <strong className="text-white">{agent.callsCount} calls</strong>
                </span>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/agents/${agent.id}`}
                    className="px-3.5 py-1.5 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    Configure & Test
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
