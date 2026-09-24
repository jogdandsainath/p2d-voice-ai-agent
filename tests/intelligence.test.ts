import { describe, it, expect } from 'vitest';
import { IntelligenceAnalyzer, MockLLMProvider } from '../packages/ai/src/index.js';
import { TranscriptMessage } from '@p2d/shared';

describe('Post-Call Conversation Intelligence Pipeline', () => {
  const analyzer = new IntelligenceAnalyzer(new MockLLMProvider());

  const sampleMessages: TranscriptMessage[] = [
    {
      id: 'm1',
      conversationId: 'c1',
      speaker: 'agent',
      text: 'Hello, welcome to P2D!',
      startTime: 0,
      endTime: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'm2',
      conversationId: 'c1',
      speaker: 'customer',
      text: 'Hi, this is Vikram from Apex Logistics. Can we schedule a demo on Tuesday?',
      startTime: 3,
      endTime: 7,
      createdAt: new Date().toISOString(),
    },
  ];

  it('should extract structured summary, intent, sentiment, and action items', async () => {
    const { analysis, actions } = await analyzer.analyzeConversation(
      'c1',
      'org_p2d_prod',
      sampleMessages,
      '+14155559876'
    );

    expect(analysis.intent).toBe('demo_request');
    expect(analysis.outcome).toBe('qualified_lead');
    expect(analysis.customerName).toBe('Vikram');
    expect(analysis.organization).toBe('Apex Logistics');
    expect(analysis.nextBestAction).toBeDefined();

    expect(actions.length).toBeGreaterThan(0);
    expect(actions[0].actionType).toBe('schedule_demo');
    expect(actions[0].status).toBe('Detected');
  });
});
