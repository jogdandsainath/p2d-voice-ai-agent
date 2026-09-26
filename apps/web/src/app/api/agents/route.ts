import { NextResponse } from 'next/server';
import { memoryStore } from '@p2d/database';

export async function GET() {
  const agents = Array.from(memoryStore.agents.values());
  const enriched = agents.map(agent => {
    const version = agent.publishedVersionId
      ? memoryStore.agentVersions.get(agent.publishedVersionId)
      : Array.from(memoryStore.agentVersions.values()).find(v => v.agentId === agent.id);
    return { ...agent, activeVersion: version };
  });
  return NextResponse.json({ agents: enriched });
}

export async function POST(request: Request) {
  const body = await request.json();
  const agentId = `agent_${Date.now()}`;
  const versionId = `ver_${Date.now()}`;

  const newAgent = {
    id: agentId,
    organizationId: 'org_p2d_prod',
    name: body.name || 'New Voice Agent',
    description: body.description || 'Voice AI Agent',
    avatarUrl: body.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    status: 'Draft' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const newVersion = {
    id: versionId,
    agentId,
    versionNumber: '1.0.0-draft',
    systemPrompt: body.systemPrompt || 'You are a helpful P2D Voice AI assistant.',
    personality: body.personality || 'Professional and polite',
    voiceConfig: {
      provider: body.voiceProvider || 'elevenlabs',
      voiceId: body.voiceId || '21m00Tcm4TlvDq8ikWAM',
      voiceName: body.voiceName || 'Rachel',
      language: body.language || 'en-US',
      stability: body.stability ?? 0.75,
      similarityBoost: body.similarityBoost ?? 0.8,
      speed: body.speed ?? 1.0,
    },
    modelConfig: {
      provider: body.modelProvider || 'gemini',
      model: body.model || 'gemini-1.5-flash',
      temperature: body.temperature ?? 0.5,
    },
    tools: body.tools || [],
    guardrails: body.guardrails || {},
    createdBy: 'usr_admin_01',
    createdAt: new Date().toISOString(),
  };

  memoryStore.agents.set(agentId, newAgent);
  memoryStore.agentVersions.set(versionId, newVersion);

  return NextResponse.json({ agent: { ...newAgent, activeVersion: newVersion } }, { status: 201 });
}
