# ADR-007: Multi-Tenant Isolation Strategy

## Status
Accepted

## Context
Enterprise customers require strict tenant data isolation to prevent cross-organization data leakage while running on shared cloud infrastructure.

## Decision
Implement discriminator column (`organization_id`) multi-tenancy backed by application-layer tenancy enforcement and database composite indexes on `(organization_id, id)`.
1. Every API request extracts and validates `organization_id` from the authenticated JWT / API key.
2. All database repository queries automatically enforce the `organization_id` filter.
3. Unit and integration tests verify cross-tenant access rejection.

## Consequences
- **Pros:** High resource efficiency and simple operational management without requiring separate database instances per tenant.
- **Cons:** Developers must ensure every new repository query includes `organization_id` in the WHERE clause.
