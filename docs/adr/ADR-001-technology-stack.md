# ADR-001: Technology Stack Selection

## Status
Accepted

## Context
The P2D Voice AI Agent platform requires high concurrency, low audio latency, strong typing across client and server, a modular monorepo structure, and a modern responsive enterprise UI.

## Decision
1. **Backend Runtime & Language:** Node.js (v20+) with TypeScript and Fastify for high-throughput HTTP REST APIs and low-overhead WebSocket media streaming.
2. **Frontend Framework:** Next.js (App Router), React, Tailwind CSS, Radix UI / Lucide icons, and React Flow for visual workflow graphs.
3. **Database & ORM:** PostgreSQL with Prisma ORM for type-safe schema definitions and migration management.
4. **Queue & Asynchronous Execution:** Redis with BullMQ (with in-memory fallback for lightweight testing).
5. **Testing Framework:** Vitest for rapid, ESM-native unit and integration testing.

## Consequences
- **Pros:** Full-stack TypeScript enables 100% shared DTOs and interfaces between backend and frontend. Fastify delivers lower overhead than Express for WebSocket streams.
- **Cons:** Requires managing Node.js event loop latency carefully during high-throughput audio streaming.
