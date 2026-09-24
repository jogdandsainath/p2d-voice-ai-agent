# Architecture Specification

## Project: P2D Voice AI Agent Platform
**Document Version:** 1.0.0  
**Status:** Canonical System Design  

---

## 1. System Overview & Architectural Topology

The P2D Voice AI Agent Platform is designed following **Clean Architecture**, **Domain-Driven Design (DDD)**, and **Hexagonal Provider Abstractions** (Ports & Adapters).

```mermaid
flowchart TB
    subgraph External_Ingress["Telephony & External Ingress"]
        PSTN["PSTN / Mobile Callers"]
        TWILIO["Twilio Voice Gateway"]
        INDIA_SIP["India Compliant SIP / Exotel"]
        WEB_SIM["WebRTC / Browser Simulator"]
    end

    subgraph Platform_Core["P2D Voice AI Agent Platform"]
        subgraph Ingress_Layer["Ingress & Gateway Layer"]
            GW["Voice & Webhook Gateway (Fastify / WebSocket)"]
            SEC["Auth & Tenant Context Guard"]
        end

        subgraph Core_Engines["Core Domain Services"]
            AGENT_SRV["Agent & Version Management"]
            PHONE_SRV["Phone Routing & Number Mgmt"]
            CONV_ENGINE["Conversation Engine (Turns, State, Tools)"]
            INTEL_ENGINE["Post-Call Intelligence & Extraction Engine"]
            WF_ENGINE["Visual Workflow Execution Engine (BullMQ)"]
            INT_ENGINE["Generic Integrations & P2D Event Bus"]
        end

        subgraph Provider_Adapters["Provider Adapters (Ports & Adapters)"]
            TEL_ADAPTER["Telephony Adapter (Twilio, SIP, Mock)"]
            VOICE_ADAPTER["Voice Adapter (ElevenLabs, OpenAI, Mock)"]
            LLM_ADAPTER["LLM Adapter (OpenAI, Gemini, Anthropic)"]
        end

        subgraph Data_Layer["Storage & Cache"]
            PG[(PostgreSQL Database + Prisma)]
            REDIS[(Redis Event Bus & BullMQ)]
            BLOB[(Call Recordings Storage S3/GCS)]
        end
    end

    subgraph External_Egress["Downstream Integrations & Workforce"]
        CRM["External CRMs (Salesforce, HubSpot, Zoho)"]
        HOOKS["Generic Webhooks"]
        P2D_CC["P2D Command Center / Agent Workforce"]
        EMAILS["Notification Services (Email / SMS)"]
    end

    PSTN --> TWILIO & INDIA_SIP
    TWILIO & INDIA_SIP & WEB_SIM --> GW
    GW --> SEC --> CONV_ENGINE
    CONV_ENGINE <--> TEL_ADAPTER & VOICE_ADAPTER & LLM_ADAPTER
    CONV_ENGINE --> PG & BLOB
    CONV_ENGINE -->|Call Completed Event| REDIS
    REDIS --> INTEL_ENGINE
    INTEL_ENGINE --> WF_ENGINE
    WF_ENGINE --> INT_ENGINE
    INT_ENGINE --> CRM & HOOKS & P2D_CC & EMAILS
```

---

## 2. Layered Architecture & Monorepo Package Topology

```text
p2d-voice-ai-agent/
├── apps/
│   ├── api/          # Fastify / Node.js High-throughput REST API & WebSocket Voice Gateway
│   ├── web/          # Next.js 14 / React 18 / Tailwind / Radix / React Flow Web Application
│   └── worker/       # BullMQ Asynchronous Processing Worker (Intelligence & Workflows)
│
├── packages/
│   ├── shared/       # Canonical TypeScript interfaces, Enums, DTOs, Event schemas, Errors
│   ├── database/     # Multi-tenant PostgreSQL schema (Prisma ORM), seeders, client
│   ├── telephony/    # TelephonyProvider interface + Twilio, India SIP, and Simulator adapters
│   ├── voice/        # VoiceProvider interface + ElevenLabs, OpenAI Audio, and Simulator adapters
│   ├── ai/           # LLM provider interface + Conversation Engine + Structured Intelligence analyzer
│   ├── workflows/    # Visual node-based workflow graph compiler and async execution engine
│   ├── integrations/ # Generic REST/Webhook connector framework + P2D workforce event dispatcher
│   └── auth/         # JWT token management, RBAC enforcement, AES-256-GCM secret vault
│
├── docs/             # Architecture, PRD, User Stories, Engineering Stories, ADRs
├── tests/            # End-to-end integration and simulation test suite
└── infrastructure/   # Docker Compose, Kubernetes manifests, CI/CD pipelines
```

---

## 3. Real-Time Conversation Engine Flow

```mermaid
sequenceDiagram
    autonumber
    actor Caller as Caller / User
    participant Tel as Telephony (Twilio / Simulator)
    participant GW as Voice Gateway (API)
    participant CE as Conversation Engine
    participant LLM as LLM Orchestrator
    participant Voice as Voice Provider (ElevenLabs)
    participant DB as PostgreSQL Database
    participant Q as Redis / BullMQ

    Caller->>Tel: Inbound Call Initiated
    Tel->>GW: POST /api/v1/telephony/inbound (Webhook)
    GW->>DB: Resolve Assigned Agent by Phone Number
    GW->>CE: Initialize Conversation Session (State=ACTIVE)
    CE-->>Tel: Connect Media Stream (WebSocket)
    CE->>Voice: Request Initial Greeting Audio Stream
    Voice-->>Tel: Stream Audio Chunk
    Tel-->>Caller: "Hello, this is P2D Assistant..."

    loop Real-time Audio Exchange
        Caller->>Tel: Speaks Speech Frame
        Tel->>CE: Stream Audio / Transcribed User Text
        CE->>LLM: Generate Next Turn (with Short-term Context + Tools)
        opt Tool Invocation
            LLM->>CE: Call Tool (e.g. check_calendar)
            CE->>CE: Execute Tool Logic
            CE->>LLM: Return Tool Output
        end
        LLM-->>Voice: Stream Generated Text Tokens
        Voice-->>Tel: Stream Synthesized Audio Frames
        Tel-->>Caller: Voice Response Audio
    end

    Caller->>Tel: Hangs Up Call
    Tel->>GW: POST /api/v1/telephony/status (Call Status: completed)
    GW->>CE: Terminate Session (State=COMPLETED)
    CE->>DB: Persist Recording Metadata, Transcript Segments, Timestamps
    CE->>Q: Emit "call.completed" Event
```

---

## 4. Post-Call Intelligence & Workflow Execution Pipeline

```mermaid
flowchart TD
    EVT["Event: call.completed"] --> WORKER["Worker Node (BullMQ)"]
    WORKER --> FETCH["Fetch Full Transcript & Call Metadata"]
    FETCH --> LLM_INTEL["LLM Intelligence Pipeline"]

    subgraph Intelligence_Extraction["Intelligence Extraction"]
        LLM_INTEL --> SUM["Generate Executive Summary"]
        LLM_INTEL --> INTENT["Extract Primary/Secondary Intent"]
        LLM_INTEL --> ENT["Extract Entities (Name, Org, Phone, Email)"]
        LLM_INTEL --> ACT["Extract Action Items & Commitments"]
        LLM_INTEL --> SENT["Classify Sentiment & Call Outcome"]
        LLM_INTEL --> NBA["Recommend Next Best Action (NBA)"]
    end

    Intelligence_Extraction --> PERSIST["Persist to conversation_analysis & actions Tables"]
    PERSIST --> MATCH_WF["Find Active Workflows matching Triggers (e.g., Intent == demo_request)"]
    
    subgraph Workflow_Execution["Graph Workflow Execution"]
        MATCH_WF --> EXEC_NODE["Execute Workflow Graph Nodes"]
        EXEC_NODE --> COND{"Condition Node Met?"}
        COND -- Yes --> ACTION_DISPATCH["Dispatch Action Nodes (Webhook, CRM, Email, SMS)"]
        COND -- No --> SKIP["Log Skipped Branch"]
        ACTION_DISPATCH --> P2D_DISPATCH["Dispatch P2D Workforce Event (conversation.completed)"]
    end

    P2D_DISPATCH --> LOG_STEP["Record Workflow Execution Step & Final Result"]
```

---

## 5. Security & Isolation Architecture

1. **Multi-Tenant Scoping:** Every database entity is indexed and scoped with `organization_id`. Database queries strictly validate the calling actor's tenant boundary.
2. **Role-Based Access Control (RBAC):**
   - `Owner`: Organization administrator with billing and user deletion permissions.
   - `Admin`: Full control over agents, phone numbers, workflows, integrations, and users.
   - `Builder`: Creation and editing of agents, voices, prompts, knowledge bases, and workflows.
   - `Operator`: Live call monitoring, manual call dispatch, human handoff, and conversation review.
   - `Analyst`: Read-only access to conversation transcripts, analytics dashboards, and intelligence summaries.
   - `Viewer`: Read-only access to published agents and basic reports.
3. **Secret Storage:** All integration credentials, provider API keys (ElevenLabs, Twilio, OpenAI, CRMs) are encrypted using AES-256-GCM with unique initialization vectors (IV) before persistence.
4. **Webhook Integrity:** Inbound telephony webhooks validate HMAC SHA-256 cryptographic signatures. Outbound webhooks send signed payloads via `X-P2D-Signature`.
