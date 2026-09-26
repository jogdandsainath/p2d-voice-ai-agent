import { describe, it, expect } from 'vitest';
import { HttpConnector, P2DEventBus } from '../packages/integrations/src/index';
import { Integration } from '@p2d/shared';

describe('Integrations Framework & P2D Workforce Event Bus', () => {
  const eventBus = new P2DEventBus('https://command-center.p2d.ai/api/v1/events', 'test_secret');
  const connector = new HttpConnector();

  it('P2DEventBus should generate HMAC-SHA256 signature for event payloads', () => {
    const signature = eventBus.generateSignature('{"test":"payload"}', '2026-09-24T12:00:00Z');
    expect(signature).toBeDefined();
    expect(typeof signature).toBe('string');
    expect(signature.length).toBe(64); // SHA-256 hex length
  });

  it('P2DEventBus should emit conversation.completed event', async () => {
    const result = await eventBus.emitConversationCompleted('org_p2d_prod', {
      agent: { id: 'agent_01', name: 'Sales Agent', version: '1.0.0' },
      call: { id: 'call_01', direction: 'inbound', durationSeconds: 120, callerNumber: '+14155559876', destinationNumber: '+14155552671' },
      analysis: { intent: 'demo_request', outcome: 'qualified_lead', sentiment: 'positive', summary: 'Demo booked' },
      actions: [],
    });

    expect(result.success).toBe(true);
    expect(result.eventId).toBeDefined();
  });

  it('HttpConnector should dispatch outbound requests with auth', async () => {
    const integration: Integration = {
      id: 'int_01',
      organizationId: 'org_p2d_prod',
      name: 'Test Webhook',
      provider: 'webhook',
      baseUrl: 'https://api.p2d.ai',
      authType: 'none',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const response = await connector.sendRequest(integration, { endpoint: '/test', body: { msg: 'hi' } });
    expect(response.statusCode).toBe(200);
    expect(response.data.success).toBe(true);
  });
});
