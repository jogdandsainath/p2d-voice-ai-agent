import { memoryStore } from '@p2d/database';
import { IntelligenceAnalyzer } from '@p2d/ai';
import { workflowExecutor } from '@p2d/workflows';
import { p2dEventBus } from '@p2d/integrations';
import { logger } from '@p2d/shared';

export interface ProcessCallJobData {
  conversationId: string;
  organizationId: string;
}

export class BackgroundWorker {
  private analyzer = new IntelligenceAnalyzer();

  async processCallCompletion(job: ProcessCallJobData): Promise<void> {
    const { conversationId, organizationId } = job;
    logger.info('Processing Call Completion background job', { conversationId });

    const conversation = memoryStore.conversations.get(conversationId);
    if (!conversation) {
      logger.warn(`Conversation ${conversationId} not found for worker processing`);
      return;
    }

    const call = memoryStore.calls.get(conversation.callId);
    const agent = memoryStore.agents.get(conversation.agentId);
    const messages = memoryStore.messages.get(conversationId) || [];

    // 1. Run Intelligence Analysis
    const { analysis, actions } = await this.analyzer.analyzeConversation(
      conversationId,
      organizationId,
      messages,
      call?.callerNumber
    );

    memoryStore.analyses.set(conversationId, analysis);
    memoryStore.actions.set(conversationId, actions);

    // 2. Trigger Active Workflows
    const workflows = Array.from(memoryStore.workflows.values()).filter(
      w => w.isActive && w.triggerType === 'Call Completed'
    );

    for (const workflow of workflows) {
      const execution = await workflowExecutor.execute(workflow, {
        organizationId,
        conversationId,
        call,
        analysis,
        actions,
        agent,
      });
      memoryStore.workflowExecutions.set(execution.id, execution);
    }

    // 3. Emit P2D Workforce Event
    await p2dEventBus.emitConversationCompleted(organizationId, {
      agent: {
        id: agent?.id || 'agent_01',
        name: agent?.name || 'P2D Agent',
        version: '1.0.0',
      },
      call: {
        id: call?.id || 'call_01',
        direction: call?.direction || 'inbound',
        durationSeconds: call?.durationSeconds || 0,
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

    logger.info('Call Completion processing completed', { conversationId });
  }
}

export const backgroundWorker = new BackgroundWorker();
