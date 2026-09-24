import { FastifyInstance } from 'fastify';
import { memoryStore } from '@p2d/database';
import { NotFoundError } from '@p2d/shared';

export async function conversationRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const conversations = Array.from(memoryStore.conversations.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const enriched = conversations.map(conv => {
      const call = memoryStore.calls.get(conv.callId);
      const agent = memoryStore.agents.get(conv.agentId);
      const analysis = memoryStore.analyses.get(conv.id);
      const actions = memoryStore.actions.get(conv.id) || [];
      const messages = memoryStore.messages.get(conv.id) || [];
      return {
        ...conv,
        call,
        agent,
        analysis,
        actions,
        messagesCount: messages.length,
      };
    });

    return reply.send({ conversations: enriched });
  });

  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const conv = memoryStore.conversations.get(id);
    if (!conv) throw new NotFoundError(`Conversation ${id} not found`);

    const call = memoryStore.calls.get(conv.callId);
    const agent = memoryStore.agents.get(conv.agentId);
    const messages = memoryStore.messages.get(id) || [];
    const analysis = memoryStore.analyses.get(id);
    const actions = memoryStore.actions.get(id) || [];

    return reply.send({
      conversation: {
        ...conv,
        call,
        agent,
        messages,
        analysis,
        actions,
      },
    });
  });

  app.get('/:id/transcript', async (request, reply) => {
    const { id } = request.params as { id: string };
    const messages = memoryStore.messages.get(id) || [];
    return reply.send({ conversationId: id, messages });
  });

  app.get('/:id/analysis', async (request, reply) => {
    const { id } = request.params as { id: string };
    const analysis = memoryStore.analyses.get(id);
    if (!analysis) throw new NotFoundError(`Analysis for conversation ${id} not found`);
    return reply.send({ analysis });
  });

  app.get('/:id/actions', async (request, reply) => {
    const { id } = request.params as { id: string };
    const actions = memoryStore.actions.get(id) || [];
    return reply.send({ actions });
  });
}
