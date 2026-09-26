import { NextResponse } from 'next/server';
import { memoryStore } from '@p2d/database';
import { ConversationSession, LLMFactory } from '@p2d/ai';

export async function POST(request: Request) {
  const { conversationId, userText } = await request.json();
  const conv = memoryStore.conversations.get(conversationId);
  if (!conv) {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
  }

  const agent = memoryStore.agents.get(conv.agentId)!;
  const version = agent.publishedVersionId
    ? memoryStore.agentVersions.get(agent.publishedVersionId)!
    : Array.from(memoryStore.agentVersions.values()).find(v => v.agentId === agent.id)!;

  const session = new ConversationSession({
    conversationId,
    callId: conv.callId,
    agent,
    agentVersion: version,
    llmProvider: LLMFactory.getProvider('gemini'),
  });

  const result = await session.processUserTurn(userText || 'Hello');
  memoryStore.messages.set(conversationId, session.getMessages());

  return NextResponse.json({
    conversationId,
    agentMessage: result.agentMessage,
    toolExecution: result.toolExecution,
  });
}
