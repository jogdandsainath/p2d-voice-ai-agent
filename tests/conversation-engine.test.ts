import { describe, it, expect } from 'vitest';
import { ConversationSession, MockLLMProvider } from '../packages/ai/src/index';
import { MockVoiceAdapter } from '../packages/voice/src/index';
import { Agent, AgentVersion } from '@p2d/shared';

describe('Conversation Engine & Real-Time Dialogue', () => {
  const agent: Agent = {
    id: 'agent_sales_01',
    organizationId: 'org_p2d_prod',
    name: 'P2D Sales Qualification Agent',
    description: 'SDR Agent',
    status: 'Published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const version: AgentVersion = {
    id: 'ver_01',
    agentId: agent.id,
    versionNumber: '1.0.0',
    systemPrompt: 'You are a sales qualification assistant.',
    personality: 'Professional',
    voiceConfig: { provider: 'mock', voiceId: 'mock_rachel', language: 'en-US' },
    modelConfig: { provider: 'mock', model: 'mock_model', temperature: 0.5 },
    tools: [
      {
        id: 't1',
        name: 'check_calendar_availability',
        description: 'Calendar tool',
        parameters: {},
      },
    ],
    guardrails: {},
    createdBy: 'usr_01',
    createdAt: new Date().toISOString(),
  };

  it('should initialize session, greet caller, and process user turns with tool invocation', async () => {
    const session = new ConversationSession({
      conversationId: 'conv_test_01',
      callId: 'call_test_01',
      agent,
      agentVersion: version,
      llmProvider: new MockLLMProvider(),
      voiceProvider: new MockVoiceAdapter(),
    });

    // 1. Start Session
    const greeting = await session.start();
    expect(session.state).toBe('ACTIVE');
    expect(greeting.speaker).toBe('agent');
    expect(greeting.text).toContain('Pur2Divin');

    // 2. Process User Turn 1: Identification
    const turn1 = await session.processUserTurn('Hello, my name is Vikram from Apex Logistics.');
    expect(turn1.agentMessage.speaker).toBe('agent');
    expect(turn1.agentMessage.text).toBeDefined();

    // 3. Process User Turn 2: Request Demo (Triggers Tool Calling)
    const turn2 = await session.processUserTurn('We would like to schedule a product demo on Tuesday.');
    expect(turn2.agentMessage.speaker).toBe('agent');
    expect(turn2.toolExecution).toBeDefined();
    expect(turn2.toolExecution?.toolName).toBe('check_calendar_availability');

    // 4. Complete Session
    const allMessages = session.endSession('completed');
    expect(session.state).toBe('COMPLETED');
    expect(allMessages.length).toBe(5); // 1 greeting + 2 user + 2 agent
  });
});
