'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import {
  Users,
  PhoneCall,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
  Bot,
  Play,
  TrendingUp,
} from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalAgents: 2,
    activeAgents: 2,
    phoneNumbersCount: 2,
    totalCalls: 14,
    incomingCalls: 9,
    outboundCalls: 5,
    successfulCalls: 13,
    avgCallDurationSeconds: 178,
    actionsTotal: 8,
    actionsCompleted: 6,
    actionsPending: 2,
    successRatePercent: 93,
    recentCalls: [
      {
        id: 'call_demo_01',
        callerNumber: '+14155559876',
        direction: 'inbound',
        status: 'completed',
        durationSeconds: 178,
        startedAt: '2 hours ago',
        agentName: 'P2D Sales Qualification Agent',
      },
      {
        id: 'call_out_02',
        callerNumber: '+919876543210',
        direction: 'outbound',
        status: 'completed',
        durationSeconds: 142,
        startedAt: '4 hours ago',
        agentName: 'P2D Outbound Lead Follow-up Agent',
      },
    ],
  });

  return (
    <main className="flex-1 flex flex-col">
      <Navbar title="Platform Overview & Command Center" />

      <div className="p-8 space-y-8 max-w-7xl">
        {/* Welcome Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-violet-900/40 via-indigo-900/20 to-slate-900 border border-violet-500/20 p-6 flex items-center justify-between shadow-xl">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              P2D Agent Workforce
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">Voice Execution Platform</h2>
            <p className="text-sm text-slate-300 max-w-2xl">
              Transform spoken customer conversations into structured intelligence, decisions, and automated business workflows across the enterprise.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/agents"
              className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-violet-600/30 flex items-center gap-2"
            >
              <Bot className="w-4 h-4" />
              Manage Agents
            </Link>
            <Link
              href="/workflows"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium border border-slate-700 transition-all"
            >
              Visual Workflows
            </Link>
          </div>
        </div>

        {/* Core Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0d121f] border border-slate-800 p-5 rounded-xl space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Active Agents</span>
              <Bot className="w-4 h-4 text-violet-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-white">{stats.activeAgents}</span>
              <span className="text-xs text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> 100% Online
              </span>
            </div>
          </div>

          <div className="bg-[#0d121f] border border-slate-800 p-5 rounded-xl space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Calls Today</span>
              <PhoneCall className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-white">{stats.totalCalls}</span>
              <span className="text-xs text-slate-400">
                {stats.incomingCalls} in / {stats.outboundCalls} out
              </span>
            </div>
          </div>

          <div className="bg-[#0d121f] border border-slate-800 p-5 rounded-xl space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Avg Call Duration</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-white">2m 58s</span>
              <span className="text-xs text-slate-400">{stats.avgCallDurationSeconds}s avg</span>
            </div>
          </div>

          <div className="bg-[#0d121f] border border-slate-800 p-5 rounded-xl space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Actions Completed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-white">{stats.actionsCompleted} / {stats.actionsTotal}</span>
              <span className="text-xs text-emerald-400 font-semibold">{stats.successRatePercent}% rate</span>
            </div>
          </div>
        </div>

        {/* Live Conversation Stream / Recent Calls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#0d121f] border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-semibold text-white">Recent Conversations & Executions</h3>
                <p className="text-xs text-slate-400">Live call sessions and auto-extracted actions</p>
              </div>
              <Link href="/calls" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 font-medium">
                View all <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {stats.recentCalls.map((call) => (
                <div
                  key={call.id}
                  className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-xl flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{call.agentName}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>Caller: {call.callerNumber}</span>
                        <span>•</span>
                        <span className="capitalize">{call.direction}</span>
                        <span>•</span>
                        <span>{call.durationSeconds}s</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Completed & Analyzed
                    </span>
                    <Link
                      href={`/conversations/${call.id}`}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-lg transition-colors"
                    >
                      Inspect
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-[#0d121f] border border-slate-800 rounded-2xl p-6 space-y-5">
            <h3 className="text-base font-semibold text-white border-b border-slate-800 pb-4">
              Quick Operations
            </h3>

            <div className="space-y-3">
              <Link
                href="/agents/agent_sales_01"
                className="block p-3.5 rounded-xl bg-violet-600/10 hover:bg-violet-600/20 border border-violet-500/20 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-violet-300">Launch Sales Agent Simulator</span>
                  <Play className="w-4 h-4 text-violet-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-xs text-slate-400 mt-1">Simulate inbound lead qualification conversation in browser.</p>
              </Link>

              <Link
                href="/phone-numbers"
                className="block p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-200">Provision Phone Number</span>
                  <Phone className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-xs text-slate-400 mt-1">Add Twilio or India PSTN/SIP (+91) carrier routes.</p>
              </Link>

              <Link
                href="/integrations"
                className="block p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-200">P2D Workforce Dispatch</span>
                  <Sparkles className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-xs text-slate-400 mt-1">Configure event streaming to P2D Command Center.</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
