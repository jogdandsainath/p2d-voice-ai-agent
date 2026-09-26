import { LLMProvider, GenerateTurnParams, GenerateTurnResponse } from './llm.provider';
import { logger } from '@p2d/shared';

export class MockLLMProvider implements LLMProvider {
  public readonly providerName = 'mock' as const;

  async generateTurn(params: GenerateTurnParams): Promise<GenerateTurnResponse> {
    const userMessages = params.messages.filter(m => m.role === 'user');
    const lastUserText = userMessages[userMessages.length - 1]?.content.toLowerCase() || '';

    logger.info('[Simulator LLM] Generating simulated turn for user query', { query: lastUserText });

    if (lastUserText.includes('demo') || lastUserText.includes('schedule') || lastUserText.includes('tuesday') || lastUserText.includes('meeting') || lastUserText.includes('yes')) {
      return {
        text: 'Fantastic! I have verified our availability for Tuesday at 2 PM. I have scheduled that demo session and our team will send the calendar invite immediately. Is there anything else you would like to know?',
        toolCalls: [
          {
            id: 'call_cal_sim',
            name: 'check_calendar_availability',
            arguments: { date: '2026-09-29' },
          },
        ],
      };
    }

    if (lastUserText.includes('name is') || lastUserText.includes('i am') || lastUserText.includes('this is')) {
      return {
        text: 'Great to connect with you! Could you tell me a little about your company and what you are looking to automate with voice AI?',
      };
    }

    if (lastUserText.includes('thank') || lastUserText.includes('no') || lastUserText.includes('bye') || lastUserText.includes('that is all')) {
      return {
        text: 'You are very welcome! We look forward to our session next Tuesday. Have a wonderful day!',
      };
    }

    return {
      text: 'Pur2Divin Voice AI enables real-time conversational agents, instant intelligence extraction, and automated downstream workflows. Would you like to schedule a 30-minute product demonstration?',
    };
  }

  async generateStructuredJSON<T = any>(prompt: string, schemaDescription: string): Promise<T> {
    logger.info('[Simulator LLM] Generating post-call structured intelligence extraction');
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
