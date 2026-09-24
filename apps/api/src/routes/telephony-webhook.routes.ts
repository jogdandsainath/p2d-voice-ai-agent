import { FastifyInstance } from 'fastify';
import { memoryStore } from '@p2d/database';
import { TelephonyFactory } from '@p2d/telephony';
import { logger } from '@p2d/shared';

export async function telephonyWebhookRoutes(app: FastifyInstance) {
  // Inbound Call Webhook
  app.post('/inbound', async (request, reply) => {
    const payload = request.body as Record<string, any>;
    const telephony = TelephonyFactory.getProvider('twilio');
    const inboundEvent = telephony.parseInboundWebhook(payload, {});

    logger.info('Received Inbound Telephony Webhook', {
      caller: inboundEvent.from,
      called: inboundEvent.to,
      callSid: inboundEvent.callSid,
    });

    // Lookup agent mapped to called phone number
    const phoneNumberRecord = Array.from(memoryStore.phoneNumbers.values()).find(
      p => p.phoneNumber === inboundEvent.to
    );

    const agentId = phoneNumberRecord?.assignedAgentId || 'agent_sales_01';
    const agent = memoryStore.agents.get(agentId);

    const streamUrl = `wss://api.voice.p2d.ai/media/${inboundEvent.callSid}`;
    const twiml = telephony.generateTwiMLResponse(
      streamUrl,
      `Hello, thank you for calling Pur2Divin. My name is ${agent?.name.split(' ')[0] || 'Rachel'}. How can I assist you today?`,
      true
    );

    reply.type('text/xml').send(twiml);
  });

  // Call Status Webhook
  app.post('/status', async (request, reply) => {
    const payload = request.body as Record<string, any>;
    logger.info('Received Call Status Webhook', payload);
    return reply.send({ received: true });
  });

  // Recording Finalized Webhook
  app.post('/recording', async (request, reply) => {
    const payload = request.body as Record<string, any>;
    logger.info('Received Call Recording Webhook', payload);
    return reply.send({ received: true });
  });
}
