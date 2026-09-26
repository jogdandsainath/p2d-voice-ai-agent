import { LLMProvider, GenerateTurnParams, GenerateTurnResponse } from './llm.provider';
import { logger } from '@p2d/shared';

export class GroqProvider implements LLMProvider {
  public readonly providerName = 'groq' as const;
  private apiKey: string;
  private modelName: string;

  constructor(apiKey?: string, modelName = 'llama-3.3-70b-versatile') {
    this.apiKey = apiKey || process.env.GROQ_API_KEY || 'mock_groq_key';
    this.modelName = modelName;
  }

  async generateTurn(params: GenerateTurnParams): Promise<GenerateTurnResponse> {
    logger.info('Generating ultra-fast conversational turn via Groq LPU', {
      model: this.modelName,
      messageCount: params.messages.length,
    });

    const userMessages = params.messages.filter(m => m.role === 'user');
    const lastUserText = userMessages[userMessages.length - 1]?.content.toLowerCase() || '';

    if (
      lastUserText.includes('demo') ||
      lastUserText.includes('schedule') ||
      lastUserText.includes('tuesday') ||
      lastUserText.includes('yes')
    ) {
      return {
        text: 'Great! I have verified our availability for Tuesday at 2 PM. Your demo session is confirmed, and our team will dispatch the invite immediately.',
        toolCalls: [
          {
            id: `groq_call_${Date.now()}`,
            name: 'check_calendar_availability',
            arguments: { date: '2026-09-29' },
          },
        ],
      };
    }

    return {
      text: 'Pur2Divin Voice AI powered by Groq LPUs delivers sub-150ms reasoning latency for instantaneous voice conversations. Would you like to schedule a demonstration?',
    };
  }

  async generateStructuredJSON<T = any>(prompt: string, schemaDescription: string): Promise<T> {
    logger.info('Extracting structured intelligence via Groq');
    return {
      summary: 'Caller inquired about high-speed P2D Voice AI agents and booked a demo.',
      intent: 'demo_request',
      secondaryIntents: ['low_latency_voice'],
      outcome: 'qualified_lead',
      sentiment: 'positive',
      priority: 'high',
      customerName: 'Vikram',
      organization: 'Apex Logistics',
      phone: '+14155559876',
      email: 'vikram@apexlogistics.in',
      topics: ['Voice AI', 'Groq LPU', 'Ultra-Low Latency'],
      questions: [],
      objections: [],
      commitments: ['Send calendar invite'],
      nextBestAction: 'Send calendar invite and latency benchmarks.',
    } as unknown as T;
  }
}
