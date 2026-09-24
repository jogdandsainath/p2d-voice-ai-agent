# ADR-005: Workflow Engine Design

## Status
Accepted

## Context
Conversations produce decisions and actions that must trigger business workflows (e.g. updating CRMs, scheduling meetings, notifying teams, calling external APIs). The workflow engine must support visual node graph editing (React Flow) and asynchronous, resilient execution.

## Decision
Design a DAG (Directed Acyclic Graph) workflow engine in `@p2d/workflows`:
1. Graph representation with discrete node types: `Trigger`, `Condition`, `AI Analysis`, `Webhook`, `Email`, `SMS`, `CRM`, `Wait`.
2. Asynchronous execution orchestrated via BullMQ / worker processes.
3. Every execution step is logged with input, output, duration, and error details for auditing and replayability.

## Consequences
- **Pros:** Full visibility into post-call automation; decoupled from synchronous call handling.
- **Cons:** Requires schema validation for dynamic payload template resolution.
