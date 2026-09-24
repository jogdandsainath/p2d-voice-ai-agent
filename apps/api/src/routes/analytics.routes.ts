import { FastifyInstance } from 'fastify';
import { memoryStore } from '@p2d/database';

export async function analyticsRoutes(app: FastifyInstance) {
  app.get('/dashboard', async (request, reply) => {
    const calls = Array.from(memoryStore.calls.values());
    const agents = Array.from(memoryStore.agents.values());
    const activeAgents = agents.filter(a => a.status === 'Published');
    const phoneNumbers = Array.from(memoryStore.phoneNumbers.values());
    const allActions = Array.from(memoryStore.actions.values()).flat();
    const completedActions = allActions.filter(a => a.status === 'Completed');
    const pendingActions = allActions.filter(a => a.status === 'Pending' || a.status === 'Detected');

    const totalDuration = calls.reduce((acc, c) => acc + (c.durationSeconds || 0), 0);
    const avgDuration = calls.length > 0 ? Math.round(totalDuration / calls.length) : 0;
    const successfulCalls = calls.filter(c => c.status === 'completed').length;
    const successRate = calls.length > 0 ? Math.round((successfulCalls / calls.length) * 100) : 100;

    return reply.send({
      totalAgents: agents.length,
      activeAgents: activeAgents.length,
      phoneNumbersCount: phoneNumbers.length,
      totalCalls: calls.length,
      incomingCalls: calls.filter(c => c.direction === 'inbound').length,
      outboundCalls: calls.filter(c => c.direction === 'outbound').length,
      successfulCalls,
      failedCalls: calls.filter(c => c.status === 'failed').length,
      avgCallDurationSeconds: avgDuration,
      actionsTotal: allActions.length,
      actionsCompleted: completedActions.length,
      actionsPending: pendingActions.length,
      successRatePercent: successRate,
      recentCalls: calls.slice(0, 5).map(c => ({
        ...c,
        agentName: memoryStore.agents.get(c.agentId)?.name,
      })),
    });
  });
}
