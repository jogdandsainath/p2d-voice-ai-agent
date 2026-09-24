export type WorkflowTriggerType =
  | 'Call Started'
  | 'Call Answered'
  | 'Call Completed'
  | 'Transcript Available'
  | 'Intent Detected'
  | 'Action Detected'
  | 'Lead Created'
  | 'Webhook Received'
  | 'Manual Trigger';

export type WorkflowNodeType =
  | 'Trigger'
  | 'Condition'
  | 'AI Analysis'
  | 'API Call'
  | 'Webhook'
  | 'Email'
  | 'SMS'
  | 'CRM'
  | 'Calendar'
  | 'Wait'
  | 'Human Approval'
  | 'P2D Workforce';

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  name: string;
  config: Record<string, any>;
  position?: { x: number; y: number };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  conditionValue?: string | boolean;
}

export interface Workflow {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  triggerType: WorkflowTriggerType;
  isActive: boolean;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: string;
  updatedAt: string;
}

export type WorkflowExecutionStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
export type WorkflowStepStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED';

export interface WorkflowExecutionStep {
  id: string;
  executionId: string;
  nodeId: string;
  nodeType: WorkflowNodeType;
  status: WorkflowStepStatus;
  inputData?: Record<string, any>;
  outputData?: Record<string, any>;
  errorMessage?: string;
  durationMs?: number;
  createdAt: string;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  organizationId: string;
  conversationId: string;
  status: WorkflowExecutionStatus;
  triggerPayload: Record<string, any>;
  steps: WorkflowExecutionStep[];
  startedAt: string;
  completedAt?: string;
  errorMessage?: string;
}
