'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Blocks, Plus, CheckCircle2, Globe, Shield, Sparkles, ExternalLink } from 'lucide-react';

const INTEGRATIONS = [
  {
    id: 'int_p2d_cc',
    name: 'P2D Command Center & Workforce Event Bus',
    provider: 'P2D Workforce',
    type: 'Event Bus',
    status: 'Connected',
    endpoint: 'https://api.p2d.ai/v1/events',
    desc: 'Emits standardized lifecycle events (conversation.completed, lead.qualified) to P2D Agent Workforce.',
  },
  {
    id: 'int_hubspot',
    name: 'HubSpot CRM Lead Sync',
    provider: 'HubSpot',
    type: 'REST API',
    status: 'Connected',
    endpoint: 'https://api.hubapi.com/crm/v3/objects/contacts',
    desc: 'Automatically inserts qualified sales leads from voice transcripts into HubSpot.',
  },
  {
    id: 'int_zapier',
    name: 'Zapier Post-Call Webhook',
    provider: 'Generic Webhook',
    type: 'Webhook',
    status: 'Connected',
    endpoint: 'https://hooks.zapier.com/hooks/catch/123/p2d',
    desc: 'Dispatches raw intelligence and extracted commitments to 5,000+ external apps.',
  },
];

export default function IntegrationsPage() {
  const [integrations] = useState(INTEGRATIONS);

  return (
    <main className="flex-1 flex flex-col">
      <Navbar title="Integrations & P2D Workforce Bridge" />

      <div className="p-8 space-y-6 max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Connected Ecosystems</h2>
            <p className="text-xs text-slate-400">Manage external CRMs, webhooks, encrypted API keys, and P2D event relays</p>
          </div>
          <button className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-violet-600/30 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Integration
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {integrations.map((int) => (
            <div
              key={int.id}
              className="bg-[#0d121f] border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-all shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold">
                    <Blocks className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {int.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-sm">{int.name}</h3>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{int.provider} • {int.type}</span>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{int.desc}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80">
                <span className="text-[10px] font-mono text-slate-400 truncate block">
                  {int.endpoint}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
