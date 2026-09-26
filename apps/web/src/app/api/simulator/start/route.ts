import { NextResponse } from 'next/server';
import { memoryStore } from '@p2d/database';
import { ConversationSession } from '@p2d/ai';

export async function POST(request: Request) {
  const { agentId, callerNumber } = await request.json();
  const targetAgentId = agentId || 'agent_sales_01';
  const agent = memoryStore.agents.get(targetAgentId);
  if (!agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
  }

  const version = agent.publishedVersionId
    ? memoryStore.agentVersions.get(agent.publishedVersionId)
    : Array.from(memoryStore.agentVersions.values()).find(v => v.agentId === agent.id);

  if (!version) {
    return NextResponse.json({ error: 'Agent version not found' }, { status: 404 });
  }

  const callId = `call_sim_${Date.now()}`;
  const conversationId = `conv_sim_${Date.now()}`;

  const newCall = {
    id: callId,
    organizationId: 'org_p2d_prod',
    agentId: targetAgentId,
    providerCallSid: `SIM_${Date.now()}`,
    direction: 'inbound' as const,
    callerNumber: callerNumber || '+14155559876',
    destinationNumber: '+14155552671',
    status: 'in_progress' as const,
    startedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const newConv = {
    id: conversationId,
    organizationId: 'org_p2d_prod',
    callId,
    agentId: targetAgentId,
    sessionState: 'ACTIVE' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  memoryStore.calls.set(callId, newCall);
  memoryStore.conversations.set(conversationId, newConv);

  const session = new ConversationSession({
    conversationId,
    callId,
    agent,
    agentVersion: version,
  });

  const greeting = await session.start();
  memoryStore.messages.set(conversationId, [greeting]);

  return NextResponse.json({
    callId,
    conversationId,
    agent: { id: agent.id, name: agent.name },
    greeting,
  });
}
