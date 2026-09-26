import {
  TranscriptMessage,
  ConversationAnalysis,
  ActionItem,
  logger,
} from '@p2d/shared';
import { LLMProvider } from './llm.provider';
import { MockLLMProvider } from './mock.provider';

export interface AnalysisResult {
  analysis: ConversationAnalysis;
  actions: ActionItem[];
}

export class IntelligenceAnalyzer {
  private llmProvider: LLMProvider;

  constructor(llmProvider?: LLMProvider) {
    this.llmProvider = llmProvider || new MockLLMProvider();
  }

  async analyzeConversation(
    conversationId: string,
    organizationId: string,
    messages: TranscriptMessage[],
    customerPhone?: string
  ): Promise<AnalysisResult> {
    logger.info('Analyzing post-call conversation transcript', {
      conversationId,
      messageCount: messages.length,
    });

    const transcriptText = messages
      .map(m => `[${m.speaker.toUpperCase()}]: ${m.text}`)
      .join('\n');

    // Extract structured data from LLM
    const prompt = `Analyze this customer phone conversation transcript:\n\n${transcriptText}\n\nCustomer phone: ${customerPhone || 'N/A'}`;
    const rawResult = await this.llmProvider.generateStructuredJSON<any>(prompt, 'Structured Conversation Analysis');

    const analysis: ConversationAnalysis = {
      id: `analysis_${Date.now()}`,
      conversationId,
      summary: rawResult.summary || 'Customer spoke with P2D Voice AI agent regarding platform services.',
      intent: rawResult.intent || 'general_inquiry',
      secondaryIntents: rawResult.secondaryIntents || [],
      outcome: rawResult.outcome || 'completed',
      sentiment: rawResult.sentiment || 'positive',
      priority: rawResult.priority || 'medium',
      customerName: rawResult.customerName,
      organization: rawResult.organization,
      phone: rawResult.phone || customerPhone,
      email: rawResult.email,
      topics: rawResult.topics || ['Voice AI', 'Automation'],
      questions: rawResult.questions || [],
      objections: rawResult.objections || [],
      commitments: rawResult.commitments || [],
      nextBestAction: rawResult.nextBestAction || 'Follow up with customer to confirm next steps.',
      createdAt: new Date().toISOString(),
    };

    // Extract structured action items
    const actions: ActionItem[] = [
      {
        id: `act_${Date.now()}_01`,
        conversationId,
        organizationId,
        actionType: analysis.intent === 'demo_request' ? 'schedule_demo' : 'follow_up',
        description: `Follow up regarding ${analysis.summary}`,
        owner: 'sales',
        priority: analysis.priority,
        dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
        status: 'Detected',
        confidence: 0.98,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    return { analysis, actions };
  }
}
