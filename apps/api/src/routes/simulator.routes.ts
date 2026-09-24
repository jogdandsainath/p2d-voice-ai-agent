import { FastifyInstance } from 'fastify';
import { memoryStore } from '@p2d/database';
import { ConversationSession, IntelligenceAnalyzer } from '@p2d/ai';
import { workflowExecutor } from '@p2d/workflows';
import { p2dEventBus } from '@p2d/integrations';
import { CallRecord, Conversation, NotFoundError, logger } from '@p2d/shared';

// Active in-memory simulator sessions
const activeSessions: Map<string, ConversationSession> = new Map();

export async function simulatorRoutes(app: FastifyInstance) {
  // 1. Start Simulated Call
  app.post('/start', async (request, reply) => {
    const { agentId, callerNumber, callerName } = request.body as any;
    const targetAgentId = agentId || 'agent_sales_01';
    const agent = memoryStore.agents.get(targetAgentId);
    if (!agent) throw new NotFoundError(`Agent ${targetAgentId} not found`);

    const version = agent.publishedVersionId
      ? memoryStore.agentVersions.get(agent.publishedVersionId)
      : Array.from(memoryStore.agentVersions.values()).find(v => v.agentId === agent.id);

    if (!version) throw new NotFoundError('No valid version found for agent');

    const callId = `call_sim_${Date.now()}`;
    const conversationId = `conv_sim_${Date.now()}`;

    const newCall: CallRecord = {
      id: callId,
      organizationId: 'org_p2d_prod',
      agentId: targetAgentId,
      providerCallSid: `SIM_SID_${Date.now()}`,
      direction: 'inbound',
      callerNumber: callerNumber || '+14155559876',
      destinationNumber: '+14155552671',
      status: 'in_progress',
      startedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newConv: Conversation = {
      id: conversationId,
      organizationId: 'org_p2d_prod',
      callId,
      agentId: targetAgentId,
      sessionState: 'ACTIVE',
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

    const greetingMessage = await session.start();
    memoryStore.messages.set(conversationId, [greetingMessage]);
    activeSessions.set(conversationId, session);

    return reply.status(201).send({
      callId,
      conversationId,
      agent: { id: agent.id, name: agent.name },
      greeting: greetingMessage,
    });
  });

  // 2. Process User Turn in Simulated Call
  app.post('/turn', async (request, reply) => {
    const { conversationId, userText } = request.body as any;
    const session = activeSessions.get(conversationId);
    if (!session) throw new NotFoundError(`Active conversation session ${conversationId} not found`);

    const result = await session.processUserTurn(userText || 'Hello');
    memoryStore.messages.set(conversationId, session.getMessages());

    return reply.send({
      conversationId,
      agentMessage: result.agentMessage,
      toolExecution: result.toolExecution,
    });
  });

  // 3. Complete Call & Execute End-to-End Pipeline
  app.post('/complete', async (request, reply) => {
    const { conversationId } = request.body as any;
    const session = activeSessions.get(conversationId);
    if (!session) throw new NotFoundError(`Active conversation session ${conversationId} not found`);

    const messages = session.endSession('completed');
    activeSessions.delete(conversationId);

    const conv = memoryStore.conversations.get(conversationId);
    const call = conv ? memoryStore.calls.get(conv.callId) : undefined;

    if (conv) {
      conv.sessionState = 'COMPLETED';
      conv.updatedAt = new Date().toISOString();
    }

    if (call) {
      call.status = 'completed';
      call.endedAt = new Date().toISOString();
      call.durationSeconds = Math.round(
        (new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime()) / 1000
      );
      call.recordingUrl = 'https://assets.p2d.ai/recordings/sample-sim-recording.mp3';
    }

    // Step A: Run Post-Call Intelligence Analyzer
    const analyzer = new IntelligenceAnalyzer();
    const { analysis, actions } = await analyzer.analyzeConversation(
      conversationId,
      'org_p2d_prod',
      messages,
      call?.callerNumber
    );

    memoryStore.analyses.set(conversationId, analysis);
    memoryStore.actions.set(conversationId, actions);

    // Step B: Trigger Post-Call Workflows matching Call Completed
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
        agent: session.agent,
      });
      memoryStore.workflowExecutions.set(execution.id, execution);
      workflowExecutions.push(execution);
    }

    // Step C: Emit Standardized P2D Workforce Event
    await p2dEventBus.emitConversationCompleted('org_p2d_prod', {
      agent: {
        id: session.agent.id,
        name: session.agent.name,
        version: session.agentVersion.versionNumber,
      },
      call: {
        id: call?.id || 'call_sim',
        direction: call?.direction || 'inbound',
        durationSeconds: call?.durationSeconds || 60,
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

    return reply.send({
      conversationId,
      status: 'completed',
      call,
      messages,
      analysis,
      actions,
      workflowExecutions,
    });
  });
}
