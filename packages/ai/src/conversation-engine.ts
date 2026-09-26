import {
  Agent,
  AgentVersion,
  SessionState,
  TranscriptMessage,
  logger,
} from '@p2d/shared';
import { LLMProvider, ChatTurnMessage } from './llm.provider';
import { VoiceProvider } from '@p2d/voice';
import { MockLLMProvider } from './mock.provider';

export interface ConversationSessionOptions {
  conversationId: string;
  callId: string;
  agent: Agent;
  agentVersion: AgentVersion;
  llmProvider?: LLMProvider;
  voiceProvider?: VoiceProvider;
}

export class ConversationSession {
  public readonly conversationId: string;
  public readonly callId: string;
  public readonly agent: Agent;
  public readonly agentVersion: AgentVersion;
  public state: SessionState = 'CREATED';

  private messages: TranscriptMessage[] = [];
  private llmProvider: LLMProvider;
  private voiceProvider?: VoiceProvider;
  private startTime: number;

  constructor(options: ConversationSessionOptions) {
    this.conversationId = options.conversationId;
    this.callId = options.callId;
    this.agent = options.agent;
    this.agentVersion = options.agentVersion;
    this.llmProvider = options.llmProvider || new MockLLMProvider();
    this.voiceProvider = options.voiceProvider;
    this.startTime = Date.now();
  }

  async start(): Promise<TranscriptMessage> {
    this.state = 'ACTIVE';
    logger.info('Conversation session started', {
      conversationId: this.conversationId,
      agentId: this.agent.id,
    });

    const greetingText = `Hello! Thank you for calling Pur2Divin. My name is ${this.agent.name.split(' ')[0]}. How can I help you today?`;
    const message: TranscriptMessage = {
      id: `msg_${Date.now()}_greeting`,
      conversationId: this.conversationId,
      speaker: 'agent',
      text: greetingText,
      startTime: 0.0,
      endTime: 3.5,
      confidence: 1.0,
      createdAt: new Date().toISOString(),
    };
    this.messages.push(message);
    return message;
  }

  async processUserTurn(userText: string): Promise<{
    agentMessage: TranscriptMessage;
    audioBuffer?: Buffer;
    toolExecution?: Record<string, any>;
  }> {
    const elapsedSeconds = (Date.now() - this.startTime) / 1000;
    const userMessage: TranscriptMessage = {
      id: `msg_${Date.now()}_user`,
      conversationId: this.conversationId,
      speaker: 'customer',
      text: userText,
      startTime: elapsedSeconds,
      endTime: elapsedSeconds + 2.5,
      confidence: 0.98,
      createdAt: new Date().toISOString(),
    };
    this.messages.push(userMessage);

    // Build chat history for LLM
    const chatHistory: ChatTurnMessage[] = [
      { role: 'system', content: this.agentVersion.systemPrompt },
      ...this.messages.map(m => ({
        role: (m.speaker === 'agent' ? 'assistant' : 'user') as 'assistant' | 'user',
        content: m.text,
      })),
    ];

    // Generate LLM turn
    const llmResponse = await this.llmProvider.generateTurn({
      messages: chatHistory,
      systemPrompt: this.agentVersion.systemPrompt,
      temperature: this.agentVersion.modelConfig.temperature,
      tools: this.agentVersion.tools,
    });

    let toolResult: Record<string, any> | undefined;
    if (llmResponse.toolCalls && llmResponse.toolCalls.length > 0) {
      const toolCall = llmResponse.toolCalls[0];
      logger.info('Executing agent tool call', { toolName: toolCall.name, arguments: toolCall.arguments });
      toolResult = {
        toolName: toolCall.name,
        arguments: toolCall.arguments,
        result: { availableSlots: ['2026-09-29T14:00:00Z', '2026-09-29T16:00:00Z'], status: 'confirmed' },
      };
    }

    const agentEndElapsed = (Date.now() - this.startTime) / 1000;
    const agentMessage: TranscriptMessage = {
      id: `msg_${Date.now()}_agent`,
      conversationId: this.conversationId,
      speaker: 'agent',
      text: llmResponse.text,
      startTime: agentEndElapsed,
      endTime: agentEndElapsed + 4.0,
      confidence: 1.0,
      toolCalls: toolResult ? [toolResult as any] : undefined,
      createdAt: new Date().toISOString(),
    };
    this.messages.push(agentMessage);

    // Synthesize audio
    let audioBuffer: Buffer | undefined;
    if (this.voiceProvider) {
      audioBuffer = await this.voiceProvider.synthesize(
        agentMessage.text,
        this.agentVersion.voiceConfig.voiceId,
        this.agentVersion.voiceConfig
      );
    }

    return {
      agentMessage,
      audioBuffer,
      toolExecution: toolResult,
    };
  }

  handleBargeIn(): void {
    logger.info('User interrupt/barge-in detected. Resetting current playback turn.', {
      conversationId: this.conversationId,
    });
  }

  endSession(reason = 'completed'): TranscriptMessage[] {
    this.state = reason === 'failed' ? 'FAILED' : 'COMPLETED';
    logger.info('Conversation session completed', {
      conversationId: this.conversationId,
      totalTurns: this.messages.length,
      finalState: this.state,
    });
    return this.messages;
  }

  getMessages(): TranscriptMessage[] {
    return [...this.messages];
  }
}
