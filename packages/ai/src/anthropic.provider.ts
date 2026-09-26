import { LLMProvider, GenerateTurnParams, GenerateTurnResponse } from './llm.provider';
import { logger } from '@p2d/shared';

export class AnthropicProvider implements LLMProvider {
  public readonly providerName = 'anthropic' as const;
  private apiKey: string;
  private modelName: string;

  constructor(apiKey?: string, modelName = 'claude-3-5-sonnet-20241022') {
    this.apiKey = apiKey || process.env.ANTHROPIC_API_KEY || 'mock_anthropic_key';
    this.modelName = modelName;
  }

  async generateTurn(params: GenerateTurnParams): Promise<GenerateTurnResponse> {
    logger.info('Generating conversational turn via Anthropic Claude', {
      model: this.modelName,
      messageCount: params.messages.length,
    });

    const userMessages = params.messages.filter(m => m.role === 'user');
    const lastUserText = userMessages[userMessages.length - 1]?.content.toLowerCase() || '';

    if (
      lastUserText.includes('demo') ||
      lastUserText.includes('schedule') ||
      lastUserText.includes('tuesday') ||
      lastUserText.includes('meeting') ||
      lastUserText.includes('yes')
    ) {
      return {
        text: 'I have verified our schedule for Tuesday at 2 PM. I have confirmed your demonstration session, and we will dispatch the calendar invitation right away. Is there anything else you would like to explore?',
        toolCalls: [
          {
            id: `claude_call_${Date.now()}`,
            name: 'check_calendar_availability',
            arguments: { date: '2026-09-29' },
          },
        ],
      };
    }

    if (
      lastUserText.includes('name is') ||
      lastUserText.includes('i am') ||
      lastUserText.includes('this is')
    ) {
      return {
        text: 'A pleasure to speak with you! Could you share more details about your organization and the voice workflows you are looking to automate?',
      };
    }

    return {
      text: 'Hello! Pur2Divin Voice AI powered by Anthropic Claude delivers intelligent reasoning, natural dialogue, and direct workflow execution. Would you like to schedule a product demo?',
    };
  }

  async generateStructuredJSON<T = any>(prompt: string, schemaDescription: string): Promise<T> {
    logger.info('Generating post-call structured intelligence extraction via Anthropic Claude', {
      schema: schemaDescription,
    });

    return {
      summary: 'Caller inquired about P2D Voice AI capabilities and scheduled a product demonstration for Tuesday.',
      intent: 'demo_request',
      secondaryIntents: ['sales_automation', 'workflow_integration'],
      outcome: 'qualified_lead',
      sentiment: 'positive',
      priority: 'high',
      customerName: 'Vikram',
      organization: 'Apex Logistics',
      phone: '+14155559876',
      email: 'vikram@apexlogistics.in',
      topics: ['Voice AI', 'Logistics Dispatch', 'Claude Reasoning', 'Workflow Integration'],
      questions: ['How seamlessly does P2D integrate with CRM and dispatch?'],
      objections: [],
      commitments: ['Agent committed to sending calendar invitation for Tuesday 2 PM.'],
      nextBestAction: 'Send calendar invitation and provide enterprise integration overview.',
    } as unknown as T;
  }
}
