import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildApp } from '../apps/api/src/app.js';
import { FastifyInstance } from 'fastify';

describe('P2D Voice AI Platform - End-to-End Master Lifecycle Verification', () => {
  let app: FastifyInstance;
  let authToken: string;
  let agentId: string;
  let conversationId: string;

  beforeAll(async () => {
    app = buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  // 1. Health Check
  it('Step 1: Health checks return 200 OK', async () => {
    const res = await app.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.status).toBe('ok');
  });

  // 2. Auth Login
  it('Step 2: User logs in and receives scoped JWT', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { email: 'admin@p2d.ai', password: 'Password123!' },
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.token).toBeDefined();
    authToken = body.token;
  });

  // 3. Create Agent
  it('Step 3: Creates a new Voice AI Agent draft', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/agents',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'E2E Admissions Agent',
        description: 'Qualifies prospective students for AI degrees',
        systemPrompt: 'You are an admissions advisor at P2D University.',
        voiceProvider: 'elevenlabs',
        voiceId: '21m00Tcm4TlvDq8ikWAM',
        model: 'gpt-4o',
        temperature: 0.5,
      },
    });
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.agent.id).toBeDefined();
    expect(body.agent.status).toBe('Draft');
    agentId = body.agent.id;
  });

  // 4. Publish Agent
  it('Step 4: Publishes Agent to production version 1.0.0', async () => {
    const res = await app.inject({
      method: 'POST',
      url: `/api/v1/agents/${agentId}/publish`,
      headers: { authorization: `Bearer ${authToken}` },
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.agent.status).toBe('Published');
    expect(body.agent.publishedVersionId).toBeDefined();
  });

  // 5. Inbound/Outbound Call Simulation
  it('Step 5: Starts live simulated conversation session (AI Greets Caller)', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/simulator/start',
      payload: {
        agentId: 'agent_sales_01',
        callerNumber: '+14155559876',
        callerName: 'Vikram',
      },
    });
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.conversationId).toBeDefined();
    expect(body.greeting).toBeDefined();
    expect(body.greeting.speaker).toBe('agent');
    conversationId = body.conversationId;
  });

  // 6. User Speaks Turn with Tool Call
  it('Step 6: Processes user conversational speech turn with calendar tool trigger', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/simulator/turn',
      payload: {
        conversationId,
        userText: 'Hi Rachel, my name is Vikram. We want to schedule a product demo next Tuesday.',
      },
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.agentMessage).toBeDefined();
    expect(body.agentMessage.speaker).toBe('agent');
    expect(body.toolExecution).toBeDefined();
    expect(body.toolExecution.toolName).toBe('check_calendar_availability');
  });

  // 7. Complete Call, Extract Intelligence & Execute Workflows
  it('Step 7: Hangs up call, generates transcript, extracts intelligence, and runs workflow graph', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/simulator/complete',
      payload: { conversationId },
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.status).toBe('completed');
    expect(body.analysis).toBeDefined();
    expect(body.analysis.intent).toBe('demo_request');
    expect(body.analysis.outcome).toBe('qualified_lead');
    expect(body.actions.length).toBeGreaterThan(0);
    expect(body.workflowExecutions.length).toBeGreaterThan(0);
    expect(body.workflowExecutions[0].status).toBe('COMPLETED');
  });

  // 8. Verify Dashboard Metrics Updated
  it('Step 8: Dashboard API reflects completed conversation analytics', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/analytics/dashboard',
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.totalCalls).toBeGreaterThan(0);
    expect(body.actionsTotal).toBeGreaterThan(0);
    expect(body.successRatePercent).toBeDefined();
  });
});
