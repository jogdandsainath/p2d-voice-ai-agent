'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Phone, Plus, CheckCircle2, ShieldCheck, Clock, Settings, ArrowUpRight } from 'lucide-react';

const INITIAL_NUMBERS = [
  {
    id: 'phone_01',
    number: '+1 (415) 555-2671',
    friendlyName: 'US Primary Inbound Line',
    provider: 'Twilio Voice',
    assignedAgent: 'P2D Sales Qualification Agent',
    recording: true,
    consent: true,
    status: 'Active',
  },
  {
    id: 'phone_02',
    number: '+91 98765 43210',
    friendlyName: 'India Direct Gateway (SIP/PSTN)',
    provider: 'India Compliant SIP / Exotel',
    assignedAgent: 'P2D Sales Qualification Agent',
    recording: true,
    consent: true,
    status: 'Active',
  },
];

export default function PhoneNumbersPage() {
  const [numbers, setNumbers] = useState(INITIAL_NUMBERS);
  const [showModal, setShowModal] = useState(false);
  const [newNumber, setNewNumber] = useState('');
  const [newName, setNewName] = useState('');
  const [newProvider, setNewProvider] = useState('twilio');

  const handleAddNumber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNumber) return;
    setNumbers((prev) => [
      ...prev,
      {
        id: `phone_${Date.now()}`,
        number: newNumber,
        friendlyName: newName || 'New Phone Line',
        provider: newProvider === 'twilio' ? 'Twilio Voice' : 'India Compliant SIP',
        assignedAgent: 'P2D Sales Qualification Agent',
        recording: true,
        consent: true,
        status: 'Active',
      },
    ]);
    setShowModal(false);
    setNewNumber('');
    setNewName('');
  };

  return (
    <main className="flex-1 flex flex-col">
      <Navbar title="Phone Number Management" />

      <div className="p-8 space-y-6 max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Provisioned Phone Numbers</h2>
            <p className="text-xs text-slate-400">Configure carrier routes, recording consent, and agent assignments</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-violet-600/30 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Phone Number
          </button>
        </div>

        <div className="space-y-4">
          {numbers.map((phone) => (
            <div
              key={phone.id}
              className="bg-[#0d121f] border border-slate-800 rounded-2xl p-5 flex items-center justify-between hover:border-slate-700 transition-all shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-base font-mono">{phone.number}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {phone.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{phone.friendlyName} • Provider: {phone.provider}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs">
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase font-medium">Assigned Agent</span>
                  <span className="text-slate-200 font-semibold">{phone.assignedAgent}</span>
                </div>

                <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Recording & Consent Active
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#0d121f] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <h3 className="text-base font-bold text-white">Add Phone Number</h3>
              <form onSubmit={handleAddNumber} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Phone Number (E.164)</label>
                  <input
                    type="text"
                    placeholder="+14155550000 or +919876543210"
                    value={newNumber}
                    onChange={(e) => setNewNumber(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Friendly Name</label>
                  <input
                    type="text"
                    placeholder="Support Direct Line"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Telephony Provider</label>
                  <select
                    value={newProvider}
                    onChange={(e) => setNewProvider(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="twilio">Twilio Voice</option>
                    <option value="india_sip">India Compliant SIP / Exotel (+91)</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold"
                  >
                    Provision
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
