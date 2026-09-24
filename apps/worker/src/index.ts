import { backgroundWorker } from './worker.js';
import { logger } from '@p2d/shared';

async function startWorker() {
  logger.info('⚙️ P2D Voice AI Platform Background Worker started and listening for jobs...');
}

startWorker();
