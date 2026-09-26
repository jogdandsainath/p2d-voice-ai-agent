import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import websocket from '@fastify/websocket';
import { AppError, logger } from '@p2d/shared';

import { authRoutes } from './routes/auth.routes';
import { agentRoutes } from './routes/agent.routes';
import { phoneRoutes } from './routes/phone.routes';
import { callRoutes } from './routes/call.routes';
import { conversationRoutes } from './routes/conversation.routes';
import { workflowRoutes } from './routes/workflow.routes';
import { integrationRoutes } from './routes/integration.routes';
import { analyticsRoutes } from './routes/analytics.routes';
import { telephonyWebhookRoutes } from './routes/telephony-webhook.routes';
import { simulatorRoutes } from './routes/simulator.routes';

export function buildApp(): FastifyInstance {
  const app = fastify({
    logger: false,
  });

  // Register CORS
  app.register(cors, {
    origin: true,
    credentials: true,
  });

  // Register WebSockets
  app.register(websocket);

  // Register Swagger OpenAPI Documentation
  app.register(swagger, {
    openapi: {
      info: {
        title: 'P2D Voice AI Agent Platform API',
        description: 'Enterprise Multi-Agent Voice AI Platform & Workforce Execution API',
        version: '1.0.0',
      },
      servers: [
        { url: 'http://localhost:4000', description: 'Local Development Server' },
      ],
    },
  });

  app.register(swaggerUi, {
    routePrefix: '/docs',
  });

  // Health checks
  app.get('/health', async () => ({ status: 'ok', service: 'p2d-voice-api', timestamp: new Date().toISOString() }));
  app.get('/health/live', async () => ({ status: 'live' }));
  app.get('/health/ready', async () => ({ status: 'ready', database: 'connected', redis: 'connected' }));

  // Register REST API Route Namespaces
  app.register(authRoutes, { prefix: '/api/v1/auth' });
  app.register(agentRoutes, { prefix: '/api/v1/agents' });
  app.register(phoneRoutes, { prefix: '/api/v1/phone-numbers' });
  app.register(callRoutes, { prefix: '/api/v1/calls' });
  app.register(conversationRoutes, { prefix: '/api/v1/conversations' });
  app.register(workflowRoutes, { prefix: '/api/v1/workflows' });
  app.register(integrationRoutes, { prefix: '/api/v1/integrations' });
  app.register(analyticsRoutes, { prefix: '/api/v1/analytics' });
  app.register(telephonyWebhookRoutes, { prefix: '/api/v1/telephony' });
  app.register(simulatorRoutes, { prefix: '/api/v1/simulator' });

  // Global Error Handler
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof AppError) {
      logger.warn(`API Operational Error: ${error.message}`, {
        statusCode: error.statusCode,
        code: error.code,
        url: request.url,
      });
      return reply.status(error.statusCode).send({
        error: {
          code: error.code,
          message: error.message,
        },
      });
    }

    logger.error('Unhandled Server Error', { url: request.url }, error);
    return reply.status(500).send({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected internal error occurred.',
      },
    });
  });

  return app;
}
