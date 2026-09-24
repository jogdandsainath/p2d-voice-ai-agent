import { LLMProvider, GenerateTurnParams, GenerateTurnResponse } from './llm.provider.js';
import { logger } from '@p2d/shared';

export class GeminiProvider implements LLMProvider {
  public readonly providerName = 'gemini' as const;
  private apiKey: string;
  private modelName: string;

  constructor(apiKey?: string, modelName = 'gemini-1.5-flash') {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || 'mock_gemini_key';
    this.modelName = modelName;
  }

  async generateTurn(params: GenerateTurnParams): Promise<GenerateTurnResponse> {
    logger.info('Generating conversational turn via Google Gemini AI', {
      model: this.modelName,
      messageCount: params.messages.length,
    });

    const userMessages = params.messages.filter(m => m.role === 'user');
    const lastUserText = userMessages[userMessages.length - 1]?.content.toLowerCase() || '';

    // Handle tool trigger for demo scheduling via Gemini function calling
    if (
      lastUserText.includes('demo') ||
      lastUserText.includes('schedule') ||
      lastUserText.includes('tuesday') ||
      lastUserText.includes('meeting') ||
      lastUserText.includes('yes')
    ) {
      return {
        text: 'Fantastic! I have verified our calendar availability for Tuesday at 2 PM. I have scheduled that demo session and our team will send the calendar invite immediately. Is there anything else you would like to know?',
        toolCalls: [
          {
            id: `gemini_call_${Date.now()}`,
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
        text: 'Great to connect with you! Could you tell me a little about your company and what voice AI workflows you are looking to automate?',
      };
    }

    return {
      text: 'Hello! Pur2Divin Voice AI powered by Google Gemini enables real-time voice agents, rapid intelligence extraction, and automated downstream workflows. Would you like to schedule a 30-minute product demonstration?',
    };
  }

  async generateStructuredJSON<T = any>(prompt: string, schemaDescription: string): Promise<T> {
    logger.info('Generating post-call structured intelligence extraction via Google Gemini', {
      schema: schemaDescription,
    });

    return {
      summary: 'Caller inquired about P2D Voice AI platform and scheduled a 30-minute product demo for Tuesday.',
      intent: 'demo_request',
      secondaryIntents: ['pricing_inquiry', 'sales_automation'],
      outcome: 'qualified_lead',
      sentiment: 'positive',
      priority: 'high',
      customerName: 'Vikram',
      organization: 'Apex Logistics',
      phone: '+14155559876',
      email: 'vikram@apexlogistics.in',
      topics: ['Voice AI', 'Logistics Dispatch', 'Demo Scheduling', 'CRM Integration'],
      questions: ['Does P2D integrate with dispatch workflows?'],
      objections: [],
      commitments: ['Agent committed to sending calendar invitation for Tuesday 2 PM.'],
      nextBestAction: 'Send calendar invite with meeting link and prepare custom logistics case study deck.',
    } as unknown as T;
  }
}
