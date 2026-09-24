import { AgentToolDefinition } from '@p2d/shared';

export interface ChatTurnMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  name?: string;
  toolCallId?: string;
}

export interface GenerateTurnParams {
  messages: ChatTurnMessage[];
  systemPrompt: string;
  temperature?: number;
  tools?: AgentToolDefinition[];
}

export interface GenerateTurnResponse {
  text: string;
  toolCalls?: Array<{
    id: string;
    name: string;
    arguments: Record<string, any>;
  }>;
}

export interface LLMProvider {
  readonly providerName: string;

  generateTurn(params: GenerateTurnParams): Promise<GenerateTurnResponse>;
  generateStructuredJSON<T = any>(prompt: string, schemaDescription: string): Promise<T>;
}
