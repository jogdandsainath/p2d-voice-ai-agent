export type SessionState =
  | 'CREATED'
  | 'CONNECTING'
  | 'ACTIVE'
  | 'ON_HOLD'
  | 'TRANSFERRING'
  | 'COMPLETED'
  | 'FAILED';

export type SpeakerRole = 'agent' | 'customer' | 'system';

export interface TranscriptMessage {
  id: string;
  conversationId: string;
  speaker: SpeakerRole;
  text: string;
  startTime: number; // in seconds
  endTime: number;
  confidence?: number;
  toolCalls?: Array<{
    toolName: string;
    arguments: Record<string, any>;
    result?: Record<string, any>;
  }>;
  createdAt: string;
}

export type ActionStatus = 'Detected' | 'Pending' | 'Running' | 'Completed' | 'Failed' | 'Cancelled';

export interface ActionItem {
  id: string;
  conversationId: string;
  organizationId: string;
  actionType: string;
  description: string;
  owner: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  status: ActionStatus;
  confidence: number;
  sourceMessage?: string;
  workflowId?: string;
  executionResult?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationAnalysis {
  id: string;
  conversationId: string;
  summary: string;
  intent: string;
  secondaryIntents?: string[];
  outcome: string;
  sentiment: 'positive' | 'neutral' | 'negative' | 'mixed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  customerName?: string;
  organization?: string;
  phone?: string;
  email?: string;
  topics: string[];
  questions: string[];
  objections: string[];
  commitments: string[];
  nextBestAction: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  organizationId: string;
  callId: string;
  agentId: string;
  sessionState: SessionState;
  messages?: TranscriptMessage[];
  analysis?: ConversationAnalysis;
  actions?: ActionItem[];
  createdAt: string;
  updatedAt: string;
}
