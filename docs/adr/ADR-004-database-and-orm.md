# ADR-004: Relational Database & ORM Selection

## Status
Accepted

## Context
Voice AI systems manage highly relational data: organizations, users, agents, versions, calls, recordings, transcripts, intelligence summaries, actions, workflows, and executions. ACID compliance and relational integrity are essential.

## Decision
Adopt **PostgreSQL** as the core relational database paired with **Prisma ORM**.
1. Prisma provides end-to-end type safety, migration tracking, and clear schema modeling.
2. JSONB columns are used for flexible configurations (node parameters, tool schemas, voice settings) while maintaining strict foreign keys for relational entities.

## Consequences
- **Pros:** Strong relational guarantees, declarative migrations, excellent TypeScript developer ergonomics.
- **Cons:** High-frequency audio time-series streams are handled separately via object storage (S3/GCS) rather than raw DB rows.
