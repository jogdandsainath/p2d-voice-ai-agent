import { NextResponse } from 'next/server';
import { memoryStore } from '@p2d/database';

export async function GET() {
  const phones = Array.from(memoryStore.phoneNumbers.values());
  const enriched = phones.map(p => ({
    ...p,
    assignedAgent: p.assignedAgentId ? memoryStore.agents.get(p.assignedAgentId) : null,
  }));
  return NextResponse.json({ phoneNumbers: enriched });
}
