import { describe, it, expect } from 'vitest';
import { WorkflowExecutor, WorkflowCompiler } from '../packages/workflows/src/index';
import { Workflow } from '@p2d/shared';

describe('Workflow Builder & Graph Execution Engine', () => {
  const workflow: Workflow = {
    id: 'wf_test_01',
    organizationId: 'org_p2d_prod',
    name: 'Sales Qualification Workflow',
    triggerType: 'Call Completed',
    isActive: true,
    nodes: [
      { id: 'n1', type: 'Trigger', name: 'Trigger', config: { event: 'call.completed' } },
      { id: 'n2', type: 'Condition', name: 'Check Intent', config: { expression: "intent == 'demo_request'" } },
      { id: 'n3', type: 'CRM', name: 'Create Lead', config: { leadName: 'Vikram', company: 'Apex' } },
      { id: 'n4', type: 'Webhook', name: 'Dispatch Webhook', config: { url: 'https://api.p2d.ai/lead' } },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2' },
      { id: 'e2', source: 'n2', target: 'n3', conditionValue: 'true' },
      { id: 'e3', source: 'n3', target: 'n4' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('WorkflowCompiler should validate graph integrity', () => {
    expect(() => {
      WorkflowCompiler.validate(workflow);
    }).not.toThrow();
  });

  it('WorkflowExecutor should traverse graph and execute action nodes', async () => {
    const executor = new WorkflowExecutor();
    const execution = await executor.execute(workflow, {
      organizationId: 'org_p2d_prod',
      conversationId: 'conv_01',
      analysis: { intent: 'demo_request', sentiment: 'positive', customerName: 'Vikram' },
    });

    expect(execution.status).toBe('COMPLETED');
    expect(execution.steps.length).toBe(4);
    expect(execution.steps[2].nodeType).toBe('CRM');
    expect(execution.steps[3].nodeType).toBe('Webhook');
  });
});
