export type UserRole = 'Owner' | 'Admin' | 'Builder' | 'Operator' | 'Analyst' | 'Viewer';

export interface User {
  id: string;
  organizationId: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface TenantContext {
  organizationId: string;
  userId: string;
  role: UserRole;
  email: string;
}

export interface JWTPayload {
  sub: string; // userId
  org: string; // organizationId
  role: UserRole;
  email: string;
  iat?: number;
  exp?: number;
}
