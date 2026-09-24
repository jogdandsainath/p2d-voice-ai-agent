import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@p2d/shared': path.resolve(__dirname, './packages/shared/src/index.ts'),
      '@p2d/auth': path.resolve(__dirname, './packages/auth/src/index.ts'),
      '@p2d/database': path.resolve(__dirname, './packages/database/src/index.ts'),
      '@p2d/telephony': path.resolve(__dirname, './packages/telephony/src/index.ts'),
      '@p2d/voice': path.resolve(__dirname, './packages/voice/src/index.ts'),
      '@p2d/ai': path.resolve(__dirname, './packages/ai/src/index.ts'),
      '@p2d/workflows': path.resolve(__dirname, './packages/workflows/src/index.ts'),
      '@p2d/integrations': path.resolve(__dirname, './packages/integrations/src/index.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
