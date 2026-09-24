'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import {
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  Clock,
  Search,
  Filter,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

const INITIAL_CALLS = [
  {
    id: 'call_demo_01',
    conversationId: 'conv_demo_01',
    callerNumber: '+1 (415) 555-9876',
    destinationNumber: '+1 (415) 555-2671',
    agentName: 'P2D Sales Qualification Agent',
    direction: 'inbound',
    durationSeconds: 178,
    status: 'completed',
    intent: 'demo_request',
    outcome: 'qualified_lead',
    sentiment: 'positive',
    timestamp: '2 hours ago',
  },
  {
    id: 'call_out_02',
    conversationId: 'conv_out_02',
    callerNumber: '+1 (415) 555-2671',
    destinationNumber: '+91 98765 43210',
    agentName: 'P2D Outbound Lead Follow-up Agent',
    direction: 'outbound',
    durationSeconds: 142,
    status: 'completed',
    intent: 'lead_followup',
    outcome: 'callback_scheduled',
    sentiment: 'positive',
    timestamp: '4 hours ago',
  },
  {
    id: 'call_demo_03',
    conversationId: 'conv_demo_03',
    callerNumber: '+1 (415) 555-1122',
    destinationNumber: '+1 (415) 555-2671',
    agentName: 'P2D Sales Qualification Agent',
    direction: 'inbound',
    durationSeconds: 65,
    status: 'completed',
    intent: 'pricing_inquiry',
    outcome: 'info_provided',
    sentiment: 'neutral',
    timestamp: '1 day ago',
  },
];

export default function CallsPage() {
  const [calls] = useState(INITIAL_CALLS);
  const [filterDirection, setFilterDirection] = useState<'all' | 'inbound' | 'outbound'>('all');

  const filtered = calls.filter((c) => {
    if (filterDirection === 'all') return true;
    return c.direction === filterDirection;
  });

  return (
    <main className="flex-1 flex flex-col">
      <Navbar title="Call Center & Conversation History" />

      <div className="p-8 space-y-6 max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Call History & Transcripts</h2>
            <p className="text-xs text-slate-400">All inbound and outbound calls, recordings, and extracted intelligence</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterDirection('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterDirection === 'all'
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              All Calls
            </button>
            <button
              onClick={() => setFilterDirection('inbound')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterDirection === 'inbound'
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              Inbound
            </button>
            <button
              onClick={() => setFilterDirection('outbound')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterDirection === 'outbound'
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              Outbound
            </button>
          </div>
        </div>

        <div className="bg-[#0d121f] border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 border-b border-slate-800 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Direction / Time</th>
                <th className="p-4">Agent</th>
                <th className="p-4">Customer Number</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Intent & Outcome</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filtered.map((call) => (
                <tr key={call.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      {call.direction === 'inbound' ? (
                        <PhoneIncoming className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <PhoneOutgoing className="w-4 h-4 text-indigo-400" />
                      )}
                      <div>
                        <span className="font-semibold capitalize text-white">{call.direction}</span>
                        <span className="text-[10px] text-slate-400 block">{call.timestamp}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-slate-200">{call.agentName}</td>
                  <td className="p-4 font-mono">{call.callerNumber}</td>
                  <td className="p-4">{Math.floor(call.durationSeconds / 60)}m {call.durationSeconds % 60}s</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 font-semibold text-[10px] border border-violet-500/20">
                        {call.intent}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold text-[10px] border border-emerald-500/20">
                        {call.outcome}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/conversations/${call.conversationId}`}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold transition-colors inline-flex items-center gap-1"
                    >
                      Details <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
