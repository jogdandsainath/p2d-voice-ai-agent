import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { memoryStore } from '@p2d/database';
import { jwtService } from '@p2d/auth';
import { UnauthorizedError } from '@p2d/shared';

export async function authRoutes(app: FastifyInstance, options: FastifyPluginOptions) {
  app.post('/login', async (request, reply) => {
    const { email, password } = request.body as any;

    const user = Array.from(memoryStore.users.values()).find(u => u.email === email);
    if (!user || user.passwordHash !== password) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = jwtService.sign({
      sub: user.id,
      org: user.organizationId,
      role: user.role,
      email: user.email,
    });

    return reply.send({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organizationId: user.organizationId,
      },
    });
  });

  app.get('/me', async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or malformed Authorization header');
    }

    const token = authHeader.substring(7);
    const decoded = jwtService.verify(token);
    const user = memoryStore.users.get(decoded.sub);

    if (!user) {
      throw new UnauthorizedError('User no longer exists');
    }

    return reply.send({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organizationId: user.organizationId,
    });
  });
}
