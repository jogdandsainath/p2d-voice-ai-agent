export type P2DEventType =
  | 'call.started'
  | 'call.answered'
  | 'call.completed'
  | 'call.failed'
  | 'recording.created'
  | 'transcript.created'
  | 'conversation.analyzed'
  | 'action.detected'
  | 'action.completed'
  | 'workflow.started'
  | 'workflow.completed'
  | 'workflow.failed';

export interface P2DStandardEvent<T = Record<string, any>> {
  id: string;
  type: P2DEventType;
  organizationId: string;
  timestamp: string;
  agentId?: string;
  callId?: string;
  conversationId?: string;
  data: T;
}

export interface ConversationCompletedEventData {
  agent: {
    id: string;
    name: string;
    version: string;
  };
  call: {
    id: string;
    direction: 'inbound' | 'outbound';
    durationSeconds: number;
    callerNumber: string;
    destinationNumber: string;
  };
  customer?: {
    name?: string;
    organization?: string;
    phone?: string;
    email?: string;
  };
  analysis: {
    intent: string;
    outcome: string;
    sentiment: string;
    summary: string;
    nextBestAction?: string;
  };
  actions: Array<{
    id: string;
    actionType: string;
    description: string;
    owner: string;
    dueDate?: string;
  }>;
}
