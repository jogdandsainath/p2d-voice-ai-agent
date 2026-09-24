# ADR-006: Event-Driven Architecture & Queues

## Status
Accepted

## Context
Call lifecycle events (`call.started`, `call.completed`, `transcript.created`, `action.detected`) generate bursty post-call workloads including audio encoding, AI transcription, intelligence extraction, and workflow execution.

## Decision
Use **Redis + BullMQ** as the primary message bus and task queue for background workers. Include an in-memory queue adapter for local testing environments without Redis.

## Consequences
- **Pros:** Reliable queueing with automatic retries, exponential backoff, dead-letter queue (DLQ) support, and concurrency control.
- **Cons:** Introduces Redis infrastructure dependency in production.
