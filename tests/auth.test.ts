import { describe, it, expect } from 'vitest';
import { JwtService, RbacService } from '../packages/auth/src/index.js';

describe('Auth & RBAC Module', () => {
  const jwt = new JwtService('test_jwt_secret_must_be_32_bytes_long_123');
  const rbac = new RbacService();

  it('should sign and verify JWT token successfully', () => {
    const payload = {
      sub: 'user_123',
      org: 'org_456',
      role: 'Admin' as const,
      email: 'admin@p2d.ai',
    };

    const token = jwt.sign(payload);
    expect(typeof token).toBe('string');

    const decoded = jwt.verify(token);
    expect(decoded.sub).toBe('user_123');
    expect(decoded.org).toBe('org_456');
    expect(decoded.role).toBe('Admin');
  });

  it('should enforce RBAC permissions matrix correctly', () => {
    expect(rbac.hasPermission('Admin', 'agent:create')).toBe(true);
    expect(rbac.hasPermission('Admin', 'workflow:execute')).toBe(true);
    expect(rbac.hasPermission('Builder', 'agent:create')).toBe(true);
    expect(rbac.hasPermission('Builder', 'org:manage')).toBe(false);
    expect(rbac.hasPermission('Viewer', 'agent:create')).toBe(false);
  });

  it('should throw ForbiddenError when role lacks permission', () => {
    expect(() => {
      rbac.requirePermission('Viewer', 'agent:delete');
    }).toThrowError();
  });
});
