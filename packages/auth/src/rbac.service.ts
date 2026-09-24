import { UserRole, ForbiddenError } from '@p2d/shared';

export type Permission =
  | 'agent:read'
  | 'agent:create'
  | 'agent:edit'
  | 'agent:publish'
  | 'agent:delete'
  | 'call:read'
  | 'call:initiate'
  | 'call:transfer'
  | 'transcript:read'
  | 'recording:read'
  | 'workflow:read'
  | 'workflow:create'
  | 'workflow:edit'
  | 'workflow:execute'
  | 'integration:manage'
  | 'org:manage';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  Owner: [
    'agent:read', 'agent:create', 'agent:edit', 'agent:publish', 'agent:delete',
    'call:read', 'call:initiate', 'call:transfer',
    'transcript:read', 'recording:read',
    'workflow:read', 'workflow:create', 'workflow:edit', 'workflow:execute',
    'integration:manage', 'org:manage'
  ],
  Admin: [
    'agent:read', 'agent:create', 'agent:edit', 'agent:publish', 'agent:delete',
    'call:read', 'call:initiate', 'call:transfer',
    'transcript:read', 'recording:read',
    'workflow:read', 'workflow:create', 'workflow:edit', 'workflow:execute',
    'integration:manage', 'org:manage'
  ],
  Builder: [
    'agent:read', 'agent:create', 'agent:edit', 'agent:publish',
    'call:read',
    'transcript:read', 'recording:read',
    'workflow:read', 'workflow:create', 'workflow:edit', 'workflow:execute',
    'integration:manage'
  ],
  Operator: [
    'agent:read',
    'call:read', 'call:initiate', 'call:transfer',
    'transcript:read', 'recording:read',
    'workflow:read', 'workflow:execute'
  ],
  Analyst: [
    'agent:read',
    'call:read',
    'transcript:read', 'recording:read',
    'workflow:read'
  ],
  Viewer: [
    'agent:read',
    'call:read'
  ]
};

export class RbacService {
  hasPermission(role: UserRole, permission: Permission): boolean {
    const permissions = ROLE_PERMISSIONS[role] || [];
    return permissions.includes(permission);
  }

  requirePermission(role: UserRole, permission: Permission): void {
    if (!this.hasPermission(role, permission)) {
      throw new ForbiddenError(`Role '${role}' lacks required permission '${permission}'`);
    }
  }
}

export const rbacService = new RbacService();
