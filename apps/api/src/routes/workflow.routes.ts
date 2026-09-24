import { FastifyInstance } from 'fastify';
import { memoryStore } from '@p2d/database';
import { workflowExecutor } from '@p2d/workflows';
import { Workflow, NotFoundError } from '@p2d/shared';

export async function workflowRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const workflows = Array.from(memoryStore.workflows.values());
    const enriched = workflows.map(wf => {
      const executions = Array.from(memoryStore.workflowExecutions.values()).filter(
        e => e.workflowId === wf.id
      );
      return { ...wf, executionCount: executions.length };
    });
    return reply.send({ workflows: enriched });
  });

  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const workflow = memoryStore.workflows.get(id);
    if (!workflow) throw new NotFoundError(`Workflow ${id} not found`);

    const executions = Array.from(memoryStore.workflowExecutions.values()).filter(
      e => e.workflowId === id
    );

    return reply.send({ workflow: { ...workflow, executions } });
  });

  app.post('/', async (request, reply) => {
    const body = request.body as any;
    const workflowId = `wf_${Date.now()}`;

    const newWorkflow: Workflow = {
      id: workflowId,
      organizationId: 'org_p2d_prod',
      name: body.name || 'New Post-Call Workflow',
      description: body.description,
      triggerType: body.triggerType || 'Call Completed',
      isActive: body.isActive ?? true,
      nodes: body.nodes || [],
      edges: body.edges || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    memoryStore.workflows.set(workflowId, newWorkflow);
    return reply.status(201).send({ workflow: newWorkflow });
  });

  app.post('/:id/execute', async (request, reply) => {
    const { id } = request.params as { id: string };
    const workflow = memoryStore.workflows.get(id);
    if (!workflow) throw new NotFoundError(`Workflow ${id} not found`);

    const body = request.body as any;
    const context = {
      organizationId: 'org_p2d_prod',
      conversationId: body.conversationId || 'conv_demo_01',
      analysis: body.analysis || memoryStore.analyses.get('conv_demo_01'),
      call: body.call || memoryStore.calls.get('call_demo_01'),
    };

    const execution = await workflowExecutor.execute(workflow, context);
    memoryStore.workflowExecutions.set(execution.id, execution);

    return reply.send({ execution });
  });

  app.get('/:id/executions', async (request, reply) => {
    const { id } = request.params as { id: string };
    const executions = Array.from(memoryStore.workflowExecutions.values()).filter(
      e => e.workflowId === id
    );
    return reply.send({ executions });
  });
}
