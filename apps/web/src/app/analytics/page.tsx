'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { BarChart3, TrendingUp, Users, CheckCircle2, Clock, Bot, PieChart } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <main className="flex-1 flex flex-col">
      <Navbar title="Analytics & Conversation Intelligence" />

      <div className="p-8 space-y-6 max-w-7xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Conversation Intelligence Metrics</h2>
          <p className="text-xs text-slate-400">Aggregate insights, qualification conversion rates, and agent performance</p>
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#0d121f] border border-slate-800 p-5 rounded-2xl space-y-2">
            <span className="text-xs text-slate-400 uppercase font-semibold">Total Call Volume</span>
            <span className="text-3xl font-bold text-white block">1,428</span>
            <span className="text-xs text-emerald-400 font-medium">+18% this month</span>
          </div>

          <div className="bg-[#0d121f] border border-slate-800 p-5 rounded-2xl space-y-2">
            <span className="text-xs text-slate-400 uppercase font-semibold">Lead Qualification Rate</span>
            <span className="text-3xl font-bold text-white block">74.2%</span>
            <span className="text-xs text-emerald-400 font-medium">+5.4% vs baseline</span>
          </div>

          <div className="bg-[#0d121f] border border-slate-800 p-5 rounded-2xl space-y-2">
            <span className="text-xs text-slate-400 uppercase font-semibold">Positive Sentiment</span>
            <span className="text-3xl font-bold text-white block">88.5%</span>
            <span className="text-xs text-emerald-400 font-medium">High satisfaction</span>
          </div>

          <div className="bg-[#0d121f] border border-slate-800 p-5 rounded-2xl space-y-2">
            <span className="text-xs text-slate-400 uppercase font-semibold">Action Completion Rate</span>
            <span className="text-3xl font-bold text-white block">96.8%</span>
            <span className="text-xs text-emerald-400 font-medium">Automated workflows</span>
          </div>
        </div>

        {/* Intent Distribution & Agent Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0d121f] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-sm text-white border-b border-slate-800 pb-3">
              Top Customer Intents Detected
            </h3>
            <div className="space-y-3">
              {[
                { intent: 'Product Demo Request', percent: 54, color: 'bg-violet-500' },
                { intent: 'Pricing & Enterprise Quote', percent: 26, color: 'bg-indigo-500' },
                { intent: 'Technical Integration Inquiry', percent: 14, color: 'bg-emerald-500' },
                { intent: 'General Support Question', percent: 6, color: 'bg-slate-500' },
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{item.intent}</span>
                    <span className="font-semibold text-white">{item.percent}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2">
                    <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0d121f] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-sm text-white border-b border-slate-800 pb-3">
              Agent Performance Comparison
            </h3>
            <div className="space-y-3">
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-xs">P2D Sales Qualification Agent</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">842 calls • Avg Duration: 2m 58s</p>
                </div>
                <span className="text-xs font-bold text-emerald-400">82% Qualified</span>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-xs">P2D Outbound Follow-up Agent</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">586 calls • Avg Duration: 2m 22s</p>
                </div>
                <span className="text-xs font-bold text-emerald-400">68% Connected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
