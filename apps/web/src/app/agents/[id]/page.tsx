'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import {
  Bot,
  Mic,
  MicOff,
  Volume2,
  Sliders,
  Sparkles,
  Play,
  Square,
  Send,
  CheckCircle2,
  PhoneCall,
  ArrowLeft,
  Save,
  Globe,
  Brain,
  Wrench,
  BookOpen,
  Phone,
  Rocket,
} from 'lucide-react';

const VOICES = [
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel (Enterprise SDR)', provider: 'ElevenLabs', language: 'en-US' },
  { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi (Outbound Specialist)', provider: 'ElevenLabs', language: 'en-US' },
  { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni (Consultative Executive)', provider: 'ElevenLabs', language: 'en-US' },
  { id: 'alloy', name: 'Alloy (OpenAI Standard)', provider: 'OpenAI', language: 'en-US' },
];

export default function AgentBuilderPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'behavior' | 'voice' | 'model' | 'tools' | 'knowledge' | 'phone' | 'deployment'>('behavior');
  
  // Agent State
  const [name, setName] = useState('P2D Sales Qualification Agent');
  const [description, setDescription] = useState('Inbound SDR agent to qualify enterprise prospects and schedule product demos');
  const [systemPrompt, setSystemPrompt] = useState(`You are the P2D Sales AI assistant representing Pur2Divin. Your objective is to warmly greet the caller, understand their business needs, qualify whether they have an active voice AI or agent workforce requirement, collect their name and company, and offer to schedule a 30-minute product demonstration with our solution architecture team. Be concise, polite, and professional.`);
  const [personality, setPersonality] = useState('Professional, consultative, engaging, articulate');
  const [voiceId, setVoiceId] = useState('21m00Tcm4TlvDq8ikWAM');
  const [stability, setStability] = useState(0.75);
  const [similarity, setSimilarity] = useState(0.80);
  const [speed, setSpeed] = useState(1.0);
  const [model, setModel] = useState('gpt-4o');
  const [temperature, setTemperature] = useState(0.4);

  // Simulator State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simConversationId, setSimConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{ speaker: 'agent' | 'customer'; text: string }>>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<any | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const startSimulation = async () => {
    setIsSimulating(true);
    setLastAnalysis(null);
    const initialGreeting = `Hello! Thank you for calling Pur2Divin. My name is Rachel. How can I assist you today?`;
    setMessages([{ speaker: 'agent', text: initialGreeting }]);
    setSimConversationId(`conv_sim_${Date.now()}`);
  };

  const handleSendTurn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText;
    setInputText('');
    setMessages((prev) => [...prev, { speaker: 'customer', text: userText }]);
    setIsProcessing(true);

    setTimeout(() => {
      let agentReply = 'Pur2Divin Voice AI enables real-time conversational agents, instant intelligence extraction, and automated downstream workflows. Would you like to schedule a 30-minute product demonstration?';
      
      const lower = userText.toLowerCase();
      if (lower.includes('name is') || lower.includes('i am') || lower.includes('vikram') || lower.includes('apex')) {
        agentReply = 'Great to connect with you, Vikram! Could you tell me a little about Apex Logistics and what voice workflows you are looking to automate?';
      } else if (lower.includes('demo') || lower.includes('schedule') || lower.includes('tuesday') || lower.includes('yes') || lower.includes('sure')) {
        agentReply = 'Fantastic! I have verified our availability for Tuesday at 2 PM IST. I have scheduled that demo session and our team will send the calendar invite to your email. Is there anything else you would like to know?';
      } else if (lower.includes('thank') || lower.includes('bye') || lower.includes('no')) {
        agentReply = 'You are very welcome! We look forward to meeting on Tuesday. Have a wonderful day!';
      }

      setMessages((prev) => [...prev, { speaker: 'agent', text: agentReply }]);
      setIsProcessing(false);
    }, 600);
  };

  const endSimulation = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsSimulating(false);
      setIsProcessing(false);
      setLastAnalysis({
        summary: 'Caller Vikram from Apex Logistics inquired about automating delivery dispatch using P2D Voice AI. Successfully qualified and scheduled a 30-minute demonstration for Tuesday at 2 PM IST.',
        intent: 'demo_request',
        outcome: 'qualified_lead',
        sentiment: 'positive',
        actions: ['Schedule 30-min demo for Tuesday 2 PM IST', 'Send calendar invite to vikram@apexlogistics.in'],
        workflowTriggered: 'Post-Call Sales Qualification & CRM Dispatch (Success 200 OK)',
      });
    }, 700);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <main className="flex-1 flex flex-col">
      <Navbar title={`Agent Builder: ${name}`} />

      <div className="flex-1 flex overflow-hidden">
        {/* Main Configuration Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="flex items-center justify-between">
            <Link
              href="/agents"
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Agents
            </Link>

            <div className="flex items-center gap-3">
              {isSaved && (
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Configuration Saved
                </span>
              )}
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all"
              >
                <Save className="w-3.5 h-3.5" /> Save Draft
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-violet-600/30 flex items-center gap-1.5 transition-all"
              >
                <Rocket className="w-3.5 h-3.5" /> Publish Version 1.0.0
              </button>
            </div>
          </div>

          {/* Builder Navigation Tabs */}
          <div className="flex gap-2 border-b border-slate-800 pb-2">
            {[
              { id: 'behavior', label: 'Behavior & Prompts', icon: Brain },
              { id: 'voice', label: 'Voice & Speech', icon: Volume2 },
              { id: 'model', label: 'LLM & Reasoning', icon: Sliders },
              { id: 'tools', label: 'Tools & Functions', icon: Wrench },
              { id: 'knowledge', label: 'Knowledge & Context', icon: BookOpen },
              { id: 'phone', label: 'Phone & Routing', icon: Phone },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="bg-[#0d121f] border border-slate-800 rounded-2xl p-6 space-y-6">
            {activeTab === 'behavior' && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    System Instructions & Agent Prompt
                  </label>
                  <textarea
                    rows={8}
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-violet-500/60"
                  />
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    Define the agent's core role, conversation objectives, tone, and step-by-step qualification flow.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Personality & Demeanor
                  </label>
                  <input
                    type="text"
                    value={personality}
                    onChange={(e) => setPersonality(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500/60"
                  />
                </div>
              </div>
            )}

            {activeTab === 'voice' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                    Voice Profile Catalog
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {VOICES.map((v) => (
                      <div
                        key={v.id}
                        onClick={() => setVoiceId(v.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          voiceId === v.id
                            ? 'bg-violet-600/15 border-violet-500 text-white'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold">{v.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                            {v.provider}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 block mt-1">{v.language}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Stability ({stability})
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={stability}
                      onChange={(e) => setStability(parseFloat(e.target.value))}
                      className="w-full accent-violet-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Similarity Boost ({similarity})
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={similarity}
                      onChange={(e) => setSimilarity(parseFloat(e.target.value))}
                      className="w-full accent-violet-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Speaking Speed ({speed}x)
                    </label>
                    <input
                      type="range"
                      min="0.7"
                      max="1.5"
                      step="0.05"
                      value={speed}
                      onChange={(e) => setSpeed(parseFloat(e.target.value))}
                      className="w-full accent-violet-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'model' && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    LLM Engine
                  </label>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-violet-500/60"
                  >
                    <option value="gpt-4o">OpenAI GPT-4o (Recommended for Low Latency Voice)</option>
                    <option value="claude-3-5-sonnet">Anthropic Claude 3.5 Sonnet</option>
                    <option value="gemini-1.5-pro">Google Gemini 1.5 Pro</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Temperature ({temperature})
                  </label>
                  <input
                    type="range"
                    min="0.0"
                    max="1.0"
                    step="0.05"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-violet-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Lower temperatures ensure strict adherence to qualification scripts.</p>
                </div>
              </div>
            )}

            {activeTab === 'tools' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Active Real-Time Tools</h4>
                  <button className="px-3 py-1 bg-violet-600/20 text-violet-300 text-xs rounded-lg font-semibold border border-violet-500/30">
                    + Add Tool
                  </button>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs text-violet-400 font-semibold">check_calendar_availability</span>
                    <p className="text-xs text-slate-400 mt-0.5">Queries enterprise Google/Outlook calendar slots for demo bookings.</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                    Enabled
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'knowledge' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Knowledge Base Documents</h4>
                  <button className="px-3 py-1 bg-violet-600/20 text-violet-300 text-xs rounded-lg font-semibold border border-violet-500/30">
                    + Upload Document
                  </button>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs font-semibold text-white">Pur2Divin_Enterprise_Voice_Capabilities_v2.pdf</span>
                  <p className="text-xs text-slate-400 mt-0.5">Product specifications, pricing tiers, and SLA terms for sales queries.</p>
                </div>
              </div>
            )}

            {activeTab === 'phone' && (
              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Assigned Telephony Routes</h4>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">+1 (415) 555-2671</span>
                    <span className="text-xs text-emerald-400 font-semibold">Twilio Voice Active</span>
                  </div>
                  <p className="text-xs text-slate-400">Inbound calls route directly to this agent with automatic call recording enabled.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Live Voice Conversation Simulator */}
        <div className="w-[420px] bg-[#0b0f19] border-l border-slate-800 flex flex-col justify-between h-full">
          {/* Simulator Header */}
          <div className="p-4 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${isSimulating ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
              <h3 className="font-bold text-xs text-white uppercase tracking-wider">Agent Simulator</h3>
            </div>

            {!isSimulating ? (
              <button
                onClick={startSimulation}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all"
              >
                <Play className="w-3 h-3" /> Start Test Call
              </button>
            ) : (
              <button
                onClick={endSimulation}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition-all"
              >
                <Square className="w-3 h-3" /> End Call
              </button>
            )}
          </div>

          {/* Simulator Conversation Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {!isSimulating && !lastAnalysis && (
              <div className="text-center py-16 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto">
                  <Bot className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Click <strong>"Start Test Call"</strong> to test conversational turns, audio streaming, and automatic intelligence extraction.
                </p>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  msg.speaker === 'agent' ? 'items-start' : 'items-end'
                }`}
              >
                <span className="text-[10px] text-slate-400 font-semibold mb-1 uppercase">
                  {msg.speaker === 'agent' ? 'Rachel (AI Voice)' : 'You (Customer)'}
                </span>
                <div
                  className={`p-3 rounded-xl text-xs max-w-[85%] leading-relaxed ${
                    msg.speaker === 'agent'
                      ? 'bg-violet-600/20 text-violet-100 border border-violet-500/30 rounded-tl-none'
                      : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-tr-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex items-center gap-2 text-xs text-violet-400 italic">
                <Sparkles className="w-3.5 h-3.5 animate-spin" /> Processing response...
              </div>
            )}

            {/* Post-Call Intelligence Extraction Results */}
            {lastAnalysis && (
              <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-emerald-500/40 space-y-3 animate-fadeIn">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase">
                  <CheckCircle2 className="w-4 h-4" /> Call Intelligence Extracted
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Summary</span>
                  <p className="text-xs text-slate-200 mt-0.5">{lastAnalysis.summary}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Intent</span>
                    <span className="block font-semibold text-white">{lastAnalysis.intent}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Outcome</span>
                    <span className="block font-semibold text-emerald-400">{lastAnalysis.outcome}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Actions Extracted</span>
                  <ul className="list-disc list-inside text-xs text-slate-300 mt-1 space-y-0.5">
                    {lastAnalysis.actions.map((act: string, i: number) => (
                      <li key={i}>{act}</li>
                    ))}
                  </ul>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-violet-300">
                  ⚡ Workflow: <strong>{lastAnalysis.workflowTriggered}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Simulator Input Bar */}
          {isSimulating && (
            <form onSubmit={handleSendTurn} className="p-3 border-t border-slate-800/80 bg-slate-900/60 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Speak or type a customer message..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
              />
              <button
                type="submit"
                className="p-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
