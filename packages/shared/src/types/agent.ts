export type AgentStatus = 'Draft' | 'Testing' | 'Published' | 'Paused' | 'Archived';

export interface AgentVoiceConfig {
  provider: 'elevenlabs' | 'openai' | 'cartesia' | 'mock';
  voiceId: string;
  voiceName?: string;
  language: string;
  stability?: number;
  similarityBoost?: number;
  speed?: number;
  style?: number;
  speakerBoost?: boolean;
}

export interface AgentModelConfig {
  provider: 'openai' | 'anthropic' | 'gemini' | 'mock';
  model: string;
  temperature: number;
  maxTokens?: number;
}

export interface AgentToolDefinition {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
  endpoint?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH';
  headers?: Record<string, string>;
}

export interface AgentGuardrails {
  topicRestrictions?: string[];
  sensitiveDataMasking?: boolean;
  maxTurnCount?: number;
  prohibitedKeywords?: string[];
}

export interface Agent {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  avatarUrl?: string;
  status: AgentStatus;
  publishedVersionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgentVersion {
  id: string;
  agentId: string;
  versionNumber: string;
  systemPrompt: string;
  personality: string;
  voiceConfig: AgentVoiceConfig;
  modelConfig: AgentModelConfig;
  tools: AgentToolDefinition[];
  guardrails: AgentGuardrails;
  createdBy: string;
  createdAt: string;
}
