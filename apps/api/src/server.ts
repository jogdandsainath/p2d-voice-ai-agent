import { buildApp } from './app.js';
import { logger } from '@p2d/shared';

const PORT = parseInt(process.env.PORT || '4000', 10);
const HOST = process.env.HOST || '0.0.0.0';

async function startServer() {
  const app = buildApp();
  try {
    await app.listen({ port: PORT, host: HOST });
    logger.info(`🚀 P2D Voice AI Platform API Server listening on http://localhost:${PORT}`);
    logger.info(`📖 API OpenAPI Documentation: http://localhost:${PORT}/docs`);
  } catch (err: any) {
    logger.error('Failed to start API server', {}, err);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== 'test') {
  startServer();
}
