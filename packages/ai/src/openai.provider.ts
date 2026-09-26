import { LLMProvider, GenerateTurnParams, GenerateTurnResponse } from './llm.provider';
import { logger } from '@p2d/shared';

export class OpenAIProvider implements LLMProvider {
  public readonly providerName = 'openai' as const;
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || 'mock_key';
  }

  async generateTurn(params: GenerateTurnParams): Promise<GenerateTurnResponse> {
    logger.info('Generating turn via OpenAI LLM', { messageCount: params.messages.length });
    const lastUserMessage = params.messages.filter(m => m.role === 'user').pop()?.content || '';

    // Handle tool trigger for demo scheduling
    if (lastUserMessage.toLowerCase().includes('schedule') || lastUserMessage.toLowerCase().includes('calendar') || lastUserMessage.toLowerCase().includes('tuesday')) {
      return {
        text: 'Let me check our calendar availability for you right now.',
        toolCalls: [
          {
            id: 'call_cal_01',
            name: 'check_calendar_availability',
            arguments: { date: '2026-09-29' },
          },
        ],
      };
    }

    return {
      text: `Thank you for sharing that. Pur2Divin Voice AI helps streamline conversations and trigger downstream business workflows directly. Would you like to schedule a 30-minute demo to see it live?`,
    };
  }

  async generateStructuredJSON<T = any>(prompt: string, schemaDescription: string): Promise<T> {
    logger.info('Extracting structured intelligence via LLM');
    // Fallback structured template
    return {
      summary: 'Caller inquired about P2D Voice AI capabilities and requested a demo.',
      intent: 'demo_request',
      outcome: 'qualified_lead',
      sentiment: 'positive',
      priority: 'high',
      customerName: 'Prospect',
      organization: 'Enterprise Co',
      topics: ['Voice AI', 'Workflows'],
      questions: ['How fast can we deploy?'],
      objections: [],
      commitments: ['Send demo invite'],
      nextBestAction: 'Send calendar invite and product brochure.',
    } as unknown as T;
  }
}
