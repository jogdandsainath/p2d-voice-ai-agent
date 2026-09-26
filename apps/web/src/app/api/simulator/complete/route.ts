import { NextResponse } from 'next/server';
import { memoryStore, storageService } from '@p2d/database';
import { IntelligenceAnalyzer } from '@p2d/ai';
import { workflowExecutor } from '@p2d/workflows';
import { p2dEventBus } from '@p2d/integrations';

export async function POST(request: Request) {
  const { conversationId } = await request.json();
  const conv = memoryStore.conversations.get(conversationId);
  if (!conv) {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
  }

  const call = memoryStore.calls.get(conv.callId);
  const agent = memoryStore.agents.get(conv.agentId)!;
  const messages = memoryStore.messages.get(conversationId) || [];

  conv.sessionState = 'COMPLETED';
  conv.updatedAt = new Date().toISOString();

  if (call) {
    call.status = 'completed';
    call.endedAt = new Date().toISOString();
    call.durationSeconds = 178;
    call.recordingUrl = 'https://assets.p2d.ai/storage/p2d-voice-recordings/recordings/sample-call.mp3';
  }

  // 1. Post-Call Intelligence Extraction
  const analyzer = new IntelligenceAnalyzer();
  const { analysis, actions } = await analyzer.analyzeConversation(
    conversationId,
    'org_p2d_prod',
    messages,
    call?.callerNumber
  );

  memoryStore.analyses.set(conversationId, analysis);
  memoryStore.actions.set(conversationId, actions);

  // 2. Persist Audio, Transcript, and Summary into Neon Object Storage
  const [storedRecording, storedTranscript, storedSummary] = await Promise.all([
    storageService.storeCallRecording(conv.callId, Buffer.from('AUDIO_PAYLOAD')),
    storageService.storeTranscript(conversationId, messages),
    storageService.storeIntelligenceSummary(conversationId, analysis),
  ]);

  // 3. Execute Workflow Graph
  const workflows = Array.from(memoryStore.workflows.values()).filter(
    w => w.isActive && w.triggerType === 'Call Completed'
  );

  const workflowExecutions = [];
  for (const workflow of workflows) {
    const execution = await workflowExecutor.execute(workflow, {
      organizationId: 'org_p2d_prod',
      conversationId,
      call,
      analysis,
      actions,
      agent,
    });
    memoryStore.workflowExecutions.set(execution.id, execution);
    workflowExecutions.push(execution);
  }

  // 4. Emit P2D Workforce Event
  await p2dEventBus.emitConversationCompleted('org_p2d_prod', {
    agent: { id: agent.id, name: agent.name, version: '1.0.0' },
    call: {
      id: call?.id || 'call_01',
      direction: call?.direction || 'inbound',
      durationSeconds: call?.durationSeconds || 178,
      callerNumber: call?.callerNumber || '+14155559876',
      destinationNumber: call?.destinationNumber || '+14155552671',
    },
    customer: {
      name: analysis.customerName,
      organization: analysis.organization,
      phone: analysis.phone,
      email: analysis.email,
    },
    analysis: {
      intent: analysis.intent,
      outcome: analysis.outcome,
      sentiment: analysis.sentiment,
      summary: analysis.summary,
      nextBestAction: analysis.nextBestAction,
    },
    actions: actions.map(a => ({
      id: a.id,
      actionType: a.actionType,
      description: a.description,
      owner: a.owner,
      dueDate: a.dueDate,
    })),
  });

  return NextResponse.json({
    conversationId,
    status: 'completed',
    analysis,
    actions,
    workflowExecutions,
    storage: {
      recording: storedRecording,
      transcript: storedTranscript,
      summary: storedSummary,
    },
  });
}
