import { FastifyInstance } from 'fastify';
import { memoryStore } from '@p2d/database';
import { Agent, AgentVersion, NotFoundError } from '@p2d/shared';

export async function agentRoutes(app: FastifyInstance) {
  // List agents
  app.get('/', async (request, reply) => {
    const agents = Array.from(memoryStore.agents.values());
    const enriched = agents.map(agent => {
      const version = agent.publishedVersionId
        ? memoryStore.agentVersions.get(agent.publishedVersionId)
        : Array.from(memoryStore.agentVersions.values()).find(v => v.agentId === agent.id);
      return { ...agent, activeVersion: version };
    });
    return reply.send({ agents: enriched });
  });

  // Get agent by ID
  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const agent = memoryStore.agents.get(id);
    if (!agent) throw new NotFoundError(`Agent ${id} not found`);

    const version = agent.publishedVersionId
      ? memoryStore.agentVersions.get(agent.publishedVersionId)
      : Array.from(memoryStore.agentVersions.values()).find(v => v.agentId === agent.id);

    return reply.send({ agent: { ...agent, activeVersion: version } });
  });

  // Create agent
  app.post('/', async (request, reply) => {
    const body = request.body as any;
    const agentId = `agent_${Date.now()}`;
    const versionId = `ver_${Date.now()}`;

    const newAgent: Agent = {
      id: agentId,
      organizationId: 'org_p2d_prod',
      name: body.name || 'New Voice Agent',
      description: body.description || 'Voice AI Agent',
      avatarUrl: body.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newVersion: AgentVersion = {
      id: versionId,
      agentId,
      versionNumber: '1.0.0-draft',
      systemPrompt: body.systemPrompt || 'You are a helpful P2D Voice AI assistant.',
      personality: body.personality || 'Professional and polite',
      voiceConfig: {
        provider: body.voiceProvider || 'elevenlabs',
        voiceId: body.voiceId || '21m00Tcm4TlvDq8ikWAM',
        voiceName: body.voiceName || 'Rachel',
        language: body.language || 'en-US',
        stability: body.stability ?? 0.75,
        similarityBoost: body.similarityBoost ?? 0.8,
        speed: body.speed ?? 1.0,
      },
      modelConfig: {
        provider: body.modelProvider || 'openai',
        model: body.model || 'gpt-4o',
        temperature: body.temperature ?? 0.7,
      },
      tools: body.tools || [],
      guardrails: body.guardrails || {},
      createdBy: 'usr_admin_01',
      createdAt: new Date().toISOString(),
    };

    memoryStore.agents.set(agentId, newAgent);
    memoryStore.agentVersions.set(versionId, newVersion);

    return reply.status(201).send({ agent: { ...newAgent, activeVersion: newVersion } });
  });

  // Publish agent
  app.post('/:id/publish', async (request, reply) => {
    const { id } = request.params as { id: string };
    const agent = memoryStore.agents.get(id);
    if (!agent) throw new NotFoundError(`Agent ${id} not found`);

    const latestVersion = Array.from(memoryStore.agentVersions.values())
      .filter(v => v.agentId === id)
      .pop();

    if (!latestVersion) throw new NotFoundError('No draft version found for agent');

    const publishedVersionId = `ver_pub_${Date.now()}`;
    const publishedVersion: AgentVersion = {
      ...latestVersion,
      id: publishedVersionId,
      versionNumber: '1.0.0',
      createdAt: new Date().toISOString(),
    };

    memoryStore.agentVersions.set(publishedVersionId, publishedVersion);
    agent.status = 'Published';
    agent.publishedVersionId = publishedVersionId;
    agent.updatedAt = new Date().toISOString();
    memoryStore.agents.set(id, agent);

    return reply.send({
      message: 'Agent successfully published',
      agent: { ...agent, activeVersion: publishedVersion },
    });
  });

  // Update agent
  app.patch('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const agent = memoryStore.agents.get(id);
    if (!agent) throw new NotFoundError(`Agent ${id} not found`);

    const body = request.body as any;
    if (body.name) agent.name = body.name;
    if (body.description) agent.description = body.description;
    if (body.status) agent.status = body.status;
    agent.updatedAt = new Date().toISOString();

    const version = agent.publishedVersionId
      ? memoryStore.agentVersions.get(agent.publishedVersionId)
      : Array.from(memoryStore.agentVersions.values()).find(v => v.agentId === agent.id);

    if (version) {
      if (body.systemPrompt) version.systemPrompt = body.systemPrompt;
      if (body.personality) version.personality = body.personality;
      if (body.voiceConfig) version.voiceConfig = { ...version.voiceConfig, ...body.voiceConfig };
      if (body.modelConfig) version.modelConfig = { ...version.modelConfig, ...body.modelConfig };
    }

    return reply.send({ agent: { ...agent, activeVersion: version } });
  });
}
