'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  CheckCircle2,
  Clock,
  Sparkles,
  Bot,
  User,
  Workflow,
  ListTodo,
  TrendingUp,
  PhoneCall,
} from 'lucide-react';

const SAMPLE_CONVERSATION = {
  id: 'conv_demo_01',
  callId: 'call_demo_01',
  agentName: 'P2D Sales Qualification Agent',
  customerPhone: '+1 (415) 555-9876',
  destinationPhone: '+1 (415) 555-2671',
  direction: 'inbound',
  startedAt: 'September 24, 2026, 11:30 AM',
  durationSeconds: 178,
  status: 'Completed',
  recordingUrl: 'https://assets.p2d.ai/recordings/sample-call-01.mp3',
  messages: [
    {
      id: 'msg_01',
      speaker: 'agent',
      text: 'Hello, thank you for calling Pur2Divin! My name is Rachel. How can I assist you today?',
      startTime: 0.5,
      endTime: 4.8,
    },
    {
      id: 'msg_02',
      speaker: 'customer',
      text: 'Hi Rachel! I am Vikram from Apex Logistics. We are looking to automate our inbound delivery dispatch with AI voice agents.',
      startTime: 5.2,
      endTime: 12.4,
    },
    {
      id: 'msg_03',
      speaker: 'agent',
      text: 'That sounds like a great fit, Vikram! Our P2D Voice AI platform integrates directly with dispatch workflows and CRMs. Would you like to schedule a 30-minute demonstration next Tuesday?',
      startTime: 13.0,
      endTime: 21.5,
    },
    {
      id: 'msg_04',
      speaker: 'customer',
      text: 'Yes, Tuesday at 2 PM IST works perfectly for me and our operations head. Please send the invite to vikram@apexlogistics.in.',
      startTime: 22.0,
      endTime: 28.5,
    },
    {
      id: 'msg_05',
      speaker: 'agent',
      text: 'Excellent! I have noted Tuesday at 2 PM IST for you and your team. We will send the calendar invite and details to vikram@apexlogistics.in right away. Have a wonderful day!',
      startTime: 29.0,
      endTime: 36.2,
    },
  ],
  analysis: {
    summary: 'Caller Vikram from Apex Logistics inquired about automating delivery dispatch using P2D Voice AI. Qualified as high-priority lead and scheduled a 30-minute demonstration for next Tuesday at 2 PM IST.',
    intent: 'demo_request',
    outcome: 'qualified_lead',
    sentiment: 'positive',
    priority: 'high',
    customerName: 'Vikram',
    organization: 'Apex Logistics',
    phone: '+14155559876',
    email: 'vikram@apexlogistics.in',
    topics: ['Voice AI', 'Logistics Dispatch', 'Demo Scheduling', 'CRM Integration'],
    nextBestAction: 'Send calendar invite with meeting link and prepare custom logistics case study deck.',
  },
  actions: [
    {
      id: 'act_01',
      description: 'Send calendar invitation for 30-min demo on Tuesday at 2 PM IST to vikram@apexlogistics.in',
      owner: 'Sales SDR',
      dueDate: 'Sept 29, 2026',
      status: 'Completed',
    },
    {
      id: 'act_02',
      description: 'Send Logistics & Dispatch Voice Automation Case Study to Vikram',
      owner: 'Solutions Team',
      dueDate: 'Sept 26, 2026',
      status: 'Pending',
    },
  ],
  workflowSteps: [
    { name: 'Trigger: Call Completed', status: 'Completed', duration: '12ms' },
    { name: 'Condition: Intent == demo_request', status: 'Completed', duration: '4ms' },
    { name: 'CRM: Create Lead Record', status: 'Completed', duration: '110ms' },
    { name: 'Webhook: P2D Command Center Dispatch', status: 'Completed', duration: '85ms' },
  ],
};

export default function ConversationDetailPage({ params }: { params: { id: string } }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayTime, setCurrentPlayTime] = useState(0);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const seekTo = (time: number) => {
    setCurrentPlayTime(time);
    setIsPlaying(true);
  };

  return (
    <main className="flex-1 flex flex-col">
      <Navbar title={`Conversation Detail: ${SAMPLE_CONVERSATION.id}`} />

      <div className="flex-1 p-8 space-y-6 max-w-7xl overflow-y-auto">
        <div className="flex items-center justify-between">
          <Link
            href="/calls"
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Call History
          </Link>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> {SAMPLE_CONVERSATION.status} & Intelligence Analyzed
            </span>
          </div>
        </div>

        {/* Call Metadata & Audio Player Header */}
        <div className="bg-[#0d121f] border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">{SAMPLE_CONVERSATION.agentName}</h2>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                  <span>Caller: <strong className="text-slate-200">{SAMPLE_CONVERSATION.customerPhone}</strong></span>
                  <span>•</span>
                  <span>Line: <strong className="text-slate-200">{SAMPLE_CONVERSATION.destinationPhone}</strong></span>
                  <span>•</span>
                  <span>{SAMPLE_CONVERSATION.startedAt}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-violet-500/10 text-violet-300 border border-violet-500/20 text-xs font-semibold">
                Intent: {SAMPLE_CONVERSATION.analysis.intent}
              </span>
              <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                Outcome: {SAMPLE_CONVERSATION.analysis.outcome}
              </span>
            </div>
          </div>

          {/* Audio Waveform Player */}
          <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 flex items-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-xl bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center transition-all shadow-md shadow-violet-600/30"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <span className="text-xs font-mono text-slate-400 w-12">{formatTime(currentPlayTime)}</span>

            <div className="flex-1 h-8 flex items-center gap-1 cursor-pointer" onClick={() => seekTo(15)}>
              {[...Array(48)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all ${
                    i < (currentPlayTime / SAMPLE_CONVERSATION.durationSeconds) * 48
                      ? 'bg-violet-500 h-6'
                      : 'bg-slate-800 hover:bg-slate-700 h-3'
                  }`}
                />
              ))}
            </div>

            <span className="text-xs font-mono text-slate-400 w-12">
              {formatTime(SAMPLE_CONVERSATION.durationSeconds)}
            </span>
          </div>
        </div>

        {/* 2-Column Split: Transcript & AI Intelligence */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Transcript Column */}
          <div className="lg:col-span-7 bg-[#0d121f] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-violet-400" /> Diarized Conversation Transcript
              </h3>
              <span className="text-xs text-slate-400">Click timestamps to jump audio</span>
            </div>

            <div className="space-y-4 pt-2">
              {SAMPLE_CONVERSATION.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 p-3.5 rounded-xl border transition-all ${
                    msg.speaker === 'agent'
                      ? 'bg-violet-900/10 border-violet-500/20'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      msg.speaker === 'agent'
                        ? 'bg-violet-600 text-white'
                        : 'bg-indigo-600 text-white'
                    }`}
                  >
                    {msg.speaker === 'agent' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">
                        {msg.speaker === 'agent' ? 'Rachel (AI Voice)' : 'Vikram (Customer)'}
                      </span>
                      <button
                        onClick={() => seekTo(msg.startTime)}
                        className="text-[10px] font-mono text-violet-400 hover:underline flex items-center gap-1"
                      >
                        <Clock className="w-2.5 h-2.5" /> {formatTime(msg.startTime)}
                      </button>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Intelligence & Workflows Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Structured Intelligence Card */}
            <div className="bg-[#0d121f] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <h3 className="font-bold text-sm text-white">Post-Call AI Intelligence</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Executive Summary</span>
                  <p className="text-xs text-slate-200 mt-0.5 leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    {SAMPLE_CONVERSATION.analysis.summary}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] uppercase font-medium text-slate-400 block">Prospect Name</span>
                    <span className="font-semibold text-white">{SAMPLE_CONVERSATION.analysis.customerName}</span>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] uppercase font-medium text-slate-400 block">Organization</span>
                    <span className="font-semibold text-white">{SAMPLE_CONVERSATION.analysis.organization}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Next Best Action (NBA)</span>
                  <p className="text-xs text-violet-300 mt-0.5 font-medium bg-violet-600/10 p-2.5 rounded-xl border border-violet-500/20">
                    {SAMPLE_CONVERSATION.analysis.nextBestAction}
                  </p>
                </div>
              </div>
            </div>

            {/* Extracted Actions Card */}
            <div className="bg-[#0d121f] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <ListTodo className="w-4 h-4 text-emerald-400" /> Extracted Commitments & Actions
                </h3>
              </div>

              <div className="space-y-2.5">
                {SAMPLE_CONVERSATION.actions.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-start gap-3"
                  >
                    <CheckCircle2
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        act.status === 'Completed' ? 'text-emerald-400' : 'text-slate-500'
                      }`}
                    />
                    <div className="flex-1 text-xs">
                      <p className="text-slate-200 font-medium">{act.description}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                        <span>Owner: {act.owner}</span>
                        <span>•</span>
                        <span>Due: {act.dueDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Workflow Execution Audit */}
            <div className="bg-[#0d121f] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Workflow className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-sm text-white">Automated Workflow Execution</h3>
              </div>

              <div className="space-y-2">
                {SAMPLE_CONVERSATION.workflowSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-lg border border-slate-800 text-xs"
                  >
                    <span className="font-medium text-slate-300">{step.name}</span>
                    <span className="font-mono text-[10px] text-emerald-400">{step.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
