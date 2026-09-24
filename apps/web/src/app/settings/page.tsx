'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Settings, Shield, Key, Building2, Save, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <main className="flex-1 flex flex-col">
      <Navbar title="Platform & Organization Settings" />

      <div className="p-8 space-y-6 max-w-4xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Organization & Security Controls</h2>
          <p className="text-xs text-slate-400">Configure tenant credentials, encryption keys, compliance retention, and RBAC</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Organization Information */}
          <div className="bg-[#0d121f] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Building2 className="w-4 h-4 text-violet-400" /> Organization Profile
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Organization Name</label>
                <input
                  type="text"
                  defaultValue="Pur2Divin Enterprise"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Tenant ID</label>
                <input
                  type="text"
                  defaultValue="org_p2d_prod"
                  disabled
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Provider API Credentials */}
          <div className="bg-[#0d121f] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Key className="w-4 h-4 text-emerald-400" /> Provider Secret Vault (Encrypted AES-256-GCM)
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">ElevenLabs API Key</label>
                <input
                  type="password"
                  defaultValue="sk_elevenlabs_prod_enc_vault_9921"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Twilio Auth Token</label>
                <input
                  type="password"
                  defaultValue="tw_auth_token_enc_vault_1102"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">OpenAI API Key</label>
                <input
                  type="password"
                  defaultValue="sk-proj-openai_enc_vault_8829"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
          </div>

          {/* Compliance & Audio Retention */}
          <div className="bg-[#0d121f] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Shield className="w-4 h-4 text-indigo-400" /> Compliance & Retention Policy
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Call Recording Retention</label>
                <select className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-violet-500">
                  <option value="30">30 Days (Standard Enterprise)</option>
                  <option value="90">90 Days</option>
                  <option value="365">1 Year (Financial / HIPAA Compliance)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Default Consent Announcement</label>
                <select className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-violet-500">
                  <option value="en">English (US / Global Standard)</option>
                  <option value="en-in">English (India Compliant TRAI / DoT)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {isSaved && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4" /> Settings updated successfully
              </span>
            )}
            <button
              type="submit"
              className="ml-auto px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-violet-600/30 flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" /> Save Settings
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
