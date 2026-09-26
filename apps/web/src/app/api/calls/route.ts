import { NextResponse } from 'next/server';
import { memoryStore } from '@p2d/database';

export async function GET() {
  const calls = Array.from(memoryStore.calls.values()).sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  );
  const enriched = calls.map(call => ({
    ...call,
    agent: memoryStore.agents.get(call.agentId),
    conversation: Array.from(memoryStore.conversations.values()).find(c => c.callId === call.id),
  }));
  return NextResponse.json({ calls: enriched });
}
