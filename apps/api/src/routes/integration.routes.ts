import { FastifyInstance } from 'fastify';
import { memoryStore } from '@p2d/database';
import { cryptoService } from '@p2d/auth';
import { Integration, NotFoundError } from '@p2d/shared';

export async function integrationRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const integrations = Array.from(memoryStore.integrations.values());
    return reply.send({ integrations });
  });

  app.post('/', async (request, reply) => {
    const body = request.body as any;
    const intId = `int_${Date.now()}`;

    const newIntegration: Integration = {
      id: intId,
      organizationId: 'org_p2d_prod',
      name: body.name || 'External Service Webhook',
      provider: body.provider || 'webhook',
      baseUrl: body.baseUrl || 'https://api.p2d.ai/v1',
      authType: body.authType || 'bearer',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    memoryStore.integrations.set(intId, newIntegration);

    if (body.credentials && body.credentials.secret) {
      const encrypted = cryptoService.encrypt(body.credentials.secret);
      memoryStore.credentials.set(intId, encrypted);
    }

    return reply.status(201).send({ integration: newIntegration });
  });
}
