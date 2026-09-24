import { FastifyInstance } from 'fastify';
import { memoryStore } from '@p2d/database';
import { PhoneNumber, NotFoundError } from '@p2d/shared';

export async function phoneRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const phones = Array.from(memoryStore.phoneNumbers.values());
    const enriched = phones.map(p => ({
      ...p,
      assignedAgent: p.assignedAgentId ? memoryStore.agents.get(p.assignedAgentId) : null,
    }));
    return reply.send({ phoneNumbers: enriched });
  });

  app.post('/', async (request, reply) => {
    const body = request.body as any;
    const phoneId = `phone_${Date.now()}`;

    const newPhone: PhoneNumber = {
      id: phoneId,
      organizationId: 'org_p2d_prod',
      phoneNumber: body.phoneNumber || '+14155550000',
      provider: body.provider || 'twilio',
      assignedAgentId: body.assignedAgentId,
      friendlyName: body.friendlyName || 'New Phone Line',
      recordingEnabled: body.recordingEnabled ?? true,
      consentAnnouncement: body.consentAnnouncement ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    memoryStore.phoneNumbers.set(phoneId, newPhone);
    return reply.status(201).send({ phoneNumber: newPhone });
  });

  app.patch('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const phone = memoryStore.phoneNumbers.get(id);
    if (!phone) throw new NotFoundError(`Phone number ${id} not found`);

    const body = request.body as any;
    if (body.assignedAgentId !== undefined) phone.assignedAgentId = body.assignedAgentId;
    if (body.friendlyName) phone.friendlyName = body.friendlyName;
    if (body.recordingEnabled !== undefined) phone.recordingEnabled = body.recordingEnabled;
    if (body.consentAnnouncement !== undefined) phone.consentAnnouncement = body.consentAnnouncement;
    phone.updatedAt = new Date().toISOString();

    return reply.send({ phoneNumber: phone });
  });
}
