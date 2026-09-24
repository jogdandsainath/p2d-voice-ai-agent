import { FastifyInstance } from 'fastify';
import { memoryStore } from '@p2d/database';
import { TelephonyFactory } from '@p2d/telephony';
import { CallRecord, Conversation, NotFoundError } from '@p2d/shared';

export async function callRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const calls = Array.from(memoryStore.calls.values()).sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
    const enriched = calls.map(call => ({
      ...call,
      agent: memoryStore.agents.get(call.agentId),
      conversation: Array.from(memoryStore.conversations.values()).find(c => c.callId === call.id),
    }));
    return reply.send({ calls: enriched });
  });

  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const call = memoryStore.calls.get(id);
    if (!call) throw new NotFoundError(`Call ${id} not found`);

    const conversation = Array.from(memoryStore.conversations.values()).find(c => c.callId === call.id);
    const agent = memoryStore.agents.get(call.agentId);

    return reply.send({ call: { ...call, agent, conversation } });
  });

  app.post('/outbound', async (request, reply) => {
    const body = request.body as any;
    const agentId = body.agentId;
    const to = body.toPhoneNumber || '+14155559876';
    const from = body.fromPhoneNumber || '+14155552671';

    const agent = memoryStore.agents.get(agentId);
    if (!agent) throw new NotFoundError(`Agent ${agentId} not found`);

    const callId = `call_out_${Date.now()}`;
    const conversationId = `conv_out_${Date.now()}`;

    const telephony = TelephonyFactory.getProvider('mock');
    const telephonyResp = await telephony.initiateCall({
      to,
      from,
      agentId,
      conversationId,
      webhookUrl: 'http://localhost:4000/api/v1/telephony/inbound',
      statusCallbackUrl: 'http://localhost:4000/api/v1/telephony/status',
    });

    const newCall: CallRecord = {
      id: callId,
      organizationId: 'org_p2d_prod',
      agentId,
      providerCallSid: telephonyResp.callSid,
      direction: 'outbound',
      callerNumber: from,
      destinationNumber: to,
      status: 'initiated',
      startedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newConv: Conversation = {
      id: conversationId,
      organizationId: 'org_p2d_prod',
      callId,
      agentId,
      sessionState: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    memoryStore.calls.set(callId, newCall);
    memoryStore.conversations.set(conversationId, newConv);

    return reply.status(201).send({
      callId,
      conversationId,
      status: 'initiated',
      direction: 'outbound',
      call: newCall,
    });
  });
}
