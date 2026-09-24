'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import {
  Workflow,
  Plus,
  Play,
  Save,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Split,
  Globe,
  Database,
  Mail,
  MessageSquare,
  Clock,
  Layers,
} from 'lucide-react';

const SAMPLE_NODES = [
  { id: '1', title: 'Call Completed Trigger', type: 'Trigger', icon: Clock, desc: 'Fires when caller hangs up', color: 'border-violet-500 bg-violet-600/10 text-violet-400' },
  { id: '2', title: 'Intent = Demo Request?', type: 'Condition', icon: Split, desc: 'Evaluates if prospect requested demo', color: 'border-indigo-500 bg-indigo-600/10 text-indigo-400' },
  { id: '3', title: 'Create CRM Lead Record', type: 'CRM Lead', icon: Database, desc: 'Inserts lead with extracted entities', color: 'border-emerald-500 bg-emerald-600/10 text-emerald-400' },
  { id: '4', title: 'Dispatch P2D Webhook', type: 'Webhook', icon: Globe, desc: 'Emits event to P2D Command Center', color: 'border-amber-500 bg-amber-600/10 text-amber-400' },
];

export default function WorkflowsPage() {
  const [nodes, setNodes] = useState(SAMPLE_NODES);
  const [isSaved, setIsSaved] = useState(false);
  const [executionResult, setExecutionResult] = useState<string | null>(null);

  const handleTestRun = () => {
    setExecutionResult('Workflow executed successfully: 4 steps passed (Duration: 211ms)');
    setTimeout(() => setExecutionResult(null), 4000);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <main className="flex-1 flex flex-col">
      <Navbar title="Visual Workflow Automation Builder" />

      <div className="flex-1 flex flex-col p-8 space-y-6 max-w-7xl overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Post-Call Automation Workflows</h2>
            <p className="text-xs text-slate-400">Design visual event-driven automations triggered by voice conversations</p>
          </div>

          <div className="flex items-center gap-3">
            {executionResult && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4" /> {executionResult}
              </span>
            )}
            {isSaved && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Workflow Saved
              </span>
            )}
            <button
              onClick={handleTestRun}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
            >
              <Play className="w-3.5 h-3.5" /> Test Run Graph
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-violet-600/30 flex items-center gap-1.5 transition-all"
            >
              <Save className="w-3.5 h-3.5" /> Save Workflow
            </button>
          </div>
        </div>

        {/* Visual Graph Canvas Simulation */}
        <div className="flex-1 bg-[#0b0f19] border border-slate-800 rounded-2xl p-8 relative overflow-hidden flex flex-col justify-center items-center shadow-2xl">
          {/* Canvas Background Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:24px_24px]" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 max-w-5xl">
            {nodes.map((node, index) => {
              const Icon = node.icon;
              return (
                <React.Fragment key={node.id}>
                  <div
                    className={`w-60 p-5 rounded-2xl border ${node.color} bg-slate-900/90 backdrop-blur-md shadow-xl space-y-2 hover:scale-105 transition-all cursor-pointer`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800/80">
                        {node.type}
                      </span>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-white">{node.title}</h4>
                    <p className="text-[11px] text-slate-400">{node.desc}</p>
                  </div>

                  {index < nodes.length - 1 && (
                    <div className="hidden md:flex items-center text-slate-600">
                      <ArrowRight className="w-5 h-5 animate-pulse" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md p-2 rounded-xl border border-slate-800 text-xs text-slate-400">
            <Layers className="w-4 h-4 text-violet-400" />
            <span>Post-Call Sales Qualification & CRM Dispatch (Active)</span>
          </div>
        </div>
      </div>
    </main>
  );
}
