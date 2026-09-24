# Engineering Stories Specification

## Project: P2D Voice AI Agent Platform
**Document Version:** 1.0.0  
**Standard:** Engineering Architecture & Implementation Stories  

---

## 1. Architecture & Monorepo Foundation

### ENG-001: Monorepo Topology and Shared Packages
- **Description:** Initialize npm/pnpm monorepo structure with modular shared packages (`@p2d/shared`, `@p2d/database`, `@p2d/telephony`, `@p2d/voice`, `@p2d/ai`, `@p2d/workflows`, `@p2d/integrations`, `@p2d/auth`).
- **Technical Design:** TypeScript project references, shared base `tsconfig.base.json`, standardized ESLint, Prettier, and Vitest configuration across workspace packages.
- **Acceptance Criteria:** `npm run build` compiles all packages; cross-package imports resolve cleanly.
- **Dependencies:** None
- **Test Requirements:** Build verification test and cross-package typecheck.
- **Definition of Done:** Monorepo builds cleanly without circular dependencies.

---

## 2. Database & Data Architecture

### ENG-002: Multi-Tenant PostgreSQL Schema & Prisma Client
- **Description:** Implement complete relational schema for organizations, users, roles, agents, agent versions, phone numbers, calls, call recordings, conversations, conversation messages, conversation analysis, actions, workflows, workflow nodes, workflow edges, workflow executions, integrations, and audit logs.
- **Technical Design:** Prisma ORM schema with foreign key constraints, composite indexes on `(organization_id, id)`, timestamp columns, and JSONB columns for flexible configuration.
- **Acceptance Criteria:** Prisma migrations run idempotently; client provides type-safe query builders.
- **Dependencies:** ENG-001
- **Test Requirements:** Database schema migration test, foreign key cascade test.
- **Definition of Done:** Prisma schema validated, generated, and seeded with initial demo data.

---

## 3. Authentication, Security & Tenant Isolation

### ENG-003: JWT Authentication and RBAC Middleware
- **Description:** Implement stateless JWT authentication with tenant scoping and role-based access control guards (`Owner`, `Admin`, `Builder`, `Operator`, `Analyst`, `Viewer`).
- **Technical Design:** Fastify auth preHandler hook decoding JWT, injecting `TenantContext` (`organizationId`, `userId`, `role`), and validating required permissions against declarative route decorators.
- **Acceptance Criteria:** Unauthenticated requests receive 401; unauthorized role operations receive 403.
- **Dependencies:** ENG-002
- **Test Requirements:** Unit test JWT signing/verification and role permission evaluation.
- **Definition of Done:** Route middleware passes 100% of auth test vectors.

### ENG-004: AES-256-GCM Secret Encryption Vault
- **Description:** Provide cryptographic encryption service for storing sensitive provider API keys, Twilio auth tokens, and integration credentials.
- **Technical Design:** Uses Node.js `crypto` with `aes-256-gcm`, generating unique 16-byte initialization vectors (IV) and 16-byte authentication tags per ciphertext.
- **Acceptance Criteria:** Plaintext is never stored in DB; decryption fails if ciphertext or tag is tampered.
- **Dependencies:** ENG-001
- **Test Requirements:** Unit tests for encrypt/decrypt roundtrip and tampering detection.
- **Definition of Done:** Secret vault integrated with database integration credential models.

---

## 4. Telephony & Voice Provider Abstractions

### ENG-005: TelephonyProvider Interface and Twilio Adapter
- **Description:** Build decoupled `TelephonyProvider` abstraction with Twilio adapter supporting inbound webhooks, outbound call dispatch, media stream forwarding, call recording, and status callbacks.
- **Technical Design:** Interface `TelephonyProvider` defines `initiateCall()`, `hangupCall()`, `transferCall()`, `parseInboundWebhook()`, and `generateTwiML()`. Includes signature verification and simulator fallback.
- **Acceptance Criteria:** Twilio adapter successfully maps webhook payloads to canonical `TelephonyCallEvent` objects.
- **Dependencies:** ENG-001
- **Test Requirements:** Unit tests for Twilio webhook parser, TwiML generation, and mock adapter.
- **Definition of Done:** Adapter passes unit tests and simulator integration tests.

### ENG-006: VoiceProvider Interface and ElevenLabs Streaming Adapter
- **Description:** Implement `VoiceProvider` port with ElevenLabs low-latency voice synthesis adapter and mock audio synthesizer.
- **Technical Design:** Interface `VoiceProvider` defines `synthesize()`, `synthesizeStream()`, `getVoices()`, and `previewVoice()`. ElevenLabs adapter interacts with ElevenLabs TTS REST and WebSocket streaming APIs.
- **Acceptance Criteria:** Returns streaming audio buffers and voice catalog with latency metrics.
- **Dependencies:** ENG-001
- **Test Requirements:** Voice synthesis unit test with mocked audio streaming.
- **Definition of Done:** Voice provider integrates seamlessly with Conversation Engine.

---

## 5. AI Orchestration & Conversation Engine

### ENG-007: Conversation Engine & State Machine
- **Description:** Implement provider-independent real-time conversation session manager, turn coordinator, tool calling executor, and interruptibility handler.
- **Technical Design:** Session state machine (`CREATED`, `CONNECTING`, `ACTIVE`, `ON_HOLD`, `TRANSFERRING`, `COMPLETED`, `FAILED`). Accumulates conversation history, injects short-term and organizational context, invokes tools, and manages speech turn transitions.
- **Acceptance Criteria:** State transitions accurately reflect call lifecycle; tool calls execute and return outputs to LLM context.
- **Dependencies:** ENG-005, ENG-006
- **Test Requirements:** Unit and simulation tests for complete multi-turn conversation flow.
- **Definition of Done:** Conversation engine passes 10-turn dialogue test with tool invocation.

### ENG-008: Post-Call Conversation Intelligence Pipeline
- **Description:** Asynchronous post-call processing pipeline that analyzes completed transcripts to extract structured summaries, intents, entities, objections, action items, sentiment, and next best actions.
- **Technical Design:** Leverages LLM with structured JSON schema output validation. Persists results to `conversation_analysis` and `actions` tables.
- **Acceptance Criteria:** Correctly parses transcript and extracts structured fields matching P2D standard schema.
- **Dependencies:** ENG-007
- **Test Requirements:** Benchmark test on sample sales qualification and support transcripts.
- **Definition of Done:** Intelligence pipeline produces valid JSON analysis for 100% of test cases.

---

## 6. Workflow Engine & Integrations

### ENG-009: Visual Graph Workflow Execution Engine
- **Description:** Build an asynchronous graph execution engine capable of evaluating node conditions and triggering actions (REST API, Webhook, Email, SMS, CRM, Calendar).
- **Technical Design:** Directed graph traversal algorithm with cycle detection. Evaluates JSONPath conditions against conversation payload and dispatches actions asynchronously via BullMQ / worker.
- **Acceptance Criteria:** Nodes execute in topological order; conditional branches accurately divert execution.
- **Dependencies:** ENG-008
- **Test Requirements:** Graph traversal unit test, conditional branch evaluation test, failure retry test.
- **Definition of Done:** Workflow engine executes multi-step workflow and records step logs.

### ENG-010: Generic Integrations Platform & P2D Event Bus
- **Description:** Implement generic HTTP connector for external systems and standard P2D workforce event emitter (`conversation.completed`, `lead.qualified`, `action.detected`).
- **Technical Design:** Configurable HTTP client with automatic auth header injection (Bearer, Basic, API Key), timeout handling, retry logic with exponential backoff, and signature header generation (`X-P2D-Signature`).
- **Acceptance Criteria:** Webhooks sent to external URLs with correct payloads and headers.
- **Dependencies:** ENG-004, ENG-009
- **Test Requirements:** Webhook delivery test with mock HTTP server receiving signed payload.
- **Definition of Done:** Generic webhook integration dispatches events verified by test receiver.

---

## 7. Frontend & UI Engineering

### ENG-011: Next.js Enterprise Web Application & Dashboard
- **Description:** Build modern Next.js React application with dark/light mode, Lucide icons, responsive navigation, and real-time dashboard metrics (calls today, active agents, success rate, recent calls).
- **Technical Design:** Next.js App Router, Tailwind CSS, component architecture, client-side state management, and SWR / React Query API hooks.
- **Acceptance Criteria:** Dashboard displays live statistics and navigates cleanly across all product modules.
- **Dependencies:** ENG-001
- **Test Requirements:** Component unit tests and render tests.
- **Definition of Done:** Web UI compiles cleanly and renders responsive layouts.

### ENG-012: ElevenLabs-Inspired Agent Builder UI
- **Description:** Implement comprehensive multi-step Agent Builder with tabs: Overview, Behavior, Voice, Model, Knowledge, Tools, Phone, Workflows, Testing (Web/Phone Simulator), and Deployment.
- **Technical Design:** Form state management with live preview panel and integrated web-based conversational simulator.
- **Acceptance Criteria:** Users can configure all agent attributes and test conversation in-browser.
- **Dependencies:** ENG-011, ENG-007
- **Test Requirements:** Agent creation and update UI integration tests.
- **Definition of Done:** Agent Builder fully wired to backend REST API.

### ENG-013: React Flow Visual Workflow Builder UI
- **Description:** Interactive canvas for designing post-call workflows using React Flow nodes and edges.
- **Technical Design:** Custom React Flow nodes (Trigger, Condition, AI Analysis, API, Webhook, Email, SMS, CRM) with parameter configuration sidebars and graph serialization.
- **Acceptance Criteria:** Drag-and-drop nodes, connect edges, configure properties, and save workflow graph to database.
- **Dependencies:** ENG-011, ENG-009
- **Test Requirements:** Node connection and graph serialization tests.
- **Definition of Done:** Visual workflow builder saves and loads workflow graphs.

### ENG-014: Call Center & Interactive Conversation Details UI
- **Description:** Build rich conversation view featuring audio player, diarized transcript with timestamp jumping, extracted action item checklist, AI intelligence summary, and workflow execution steps.
- **Technical Design:** Transcript audio synchronizer, action status toggles, and metadata visualizers.
- **Acceptance Criteria:** Displays full call context and allows transcript filtering and search.
- **Dependencies:** ENG-011, ENG-008
- **Test Requirements:** Transcript rendering and audio seek event tests.
- **Definition of Done:** Conversation detail view verified with sample call records.

---

## 8. Observability, CI/CD & Production Readiness

### ENG-015: Structured Logging, Tracing and Metrics
- **Description:** Implement Pino-based structured JSON logging with correlation IDs (`requestId`, `callId`, `conversationId`, `agentId`, `workflowExecutionId`) and Prometheus health metrics.
- **Technical Design:** Fastify request hook injecting correlation IDs into logger context and propagating via HTTP headers.
- **Acceptance Criteria:** Every log entry contains tenant and correlation context.
- **Dependencies:** ENG-001
- **Test Requirements:** Log output format and correlation ID propagation test.
- **Definition of Done:** Logging and health check endpoints (`/health/live`, `/health/ready`) operational.

### ENG-016: CI/CD GitHub Actions Pipeline
- **Description:** Automated CI pipeline verifying linting, type safety, unit tests, integration tests, and build artifacts on every Pull Request and main push.
- **Technical Design:** `.github/workflows/ci.yml` running Node.js matrix, caching dependencies, running Vitest, and checking Docker build.
- **Acceptance Criteria:** All checks must pass before PR merge.
- **Dependencies:** None
- **Test Requirements:** GitHub Actions workflow syntax validation.
- **Definition of Done:** CI pipeline config committed and active.
