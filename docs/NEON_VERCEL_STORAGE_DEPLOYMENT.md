# Complete Deployment Guide: Vercel, Neon DB & Neon Object Storage

## Project: P2D Voice AI Agent Platform
**Target Stack:** Vercel (Serverless Next.js) + Neon PostgreSQL (Tables) + Neon / S3 Object Storage (Audio, Transcripts, Summaries, Figures)

---

## 1. Architectural Topology on Cloud

```mermaid
flowchart TB
    subgraph Vercel_Platform["Vercel Cloud (Apps & Serverless API Routes)"]
        UI["Next.js Enterprise Web Dashboard"]
        API["Serverless REST & Webhook Handlers (/api/*)"]
        SIM["Live Conversation Simulator Engine"]
    end

    subgraph Neon_Ecosystem["Neon Cloud Ecosystem"]
        NEON_DB[("Neon PostgreSQL Serverless DB<br/>(14 Multi-Tenant Tables)")]
        NEON_OBJ[("Neon / S3 Object Storage Bucket<br/>(Recordings, Transcripts, Figures, Summaries)")]
    end

    subgraph External_AI["AI & Telecom Providers"]
        GEMINI["Google Gemini / Anthropic Claude / OpenAI"]
        ELEVEN["ElevenLabs / Cartesia / Deepgram"]
        TWILIO["Twilio / India SIP / Plivo"]
        P2D_CC["P2D Command Center Event Bus"]
    end

    UI --> API
    API <--> NEON_DB
    API --> NEON_OBJ
    SIM <--> GEMINI & ELEVEN
    TWILIO --> API
    API --> P2D_CC
```

---

## 2. Neon Database Tables & Schema Setup

The platform includes 14 relational tables with multi-tenant scoping and composite indexing:

| Table | Purpose |
|---|---|
| `organizations` | Tenant isolation root entity |
| `users` | Organization members, credentials, and RBAC roles |
| `agents` | Voice AI agents and operational states |
| `agent_versions` | Immutable published configurations (prompts, voice, models, tools) |
| `knowledge_sources` | Context documents, URLs, and text snippets |
| `phone_numbers` | Telephony carrier numbers (Twilio, India SIP, Plivo) |
| `calls` | Inbound and outbound call records and telemetry |
| `call_recordings` | Object storage pointers and audio retention policies |
| `conversations` | Conversation session state and context |
| `conversation_messages` | Diarized transcript messages with millisecond timestamps |
| `conversation_analysis` | Extracted summaries, intents, outcomes, sentiment, and Next Best Action |
| `actions` | Extracted action items, commitments, and owners |
| `workflows` / `workflow_nodes` | Directed acyclic graph (DAG) post-call automations |
| `integrations` / `integration_credentials` | AES-256-GCM encrypted external credentials |

### Creating Neon PostgreSQL Database:
1. Go to **[https://console.neon.tech](https://console.neon.tech)** and click **"Create Project"**.
2. Name your project `p2d-voice-ai`.
3. Copy your pooled connection string:
   ```text
   DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```
4. Push tables and schema from local terminal:
   ```bash
   # Push Prisma schema to create all tables in Neon
   npm run db:push
   ```

---

## 3. Neon Object Storage (Audio Recordings, Transcripts, Summaries & Figures)

The platform includes a dedicated **Storage Service** ([`packages/database/src/storage.service.ts`](file:///D:/E-Divin-Agents/p2d-voice-ai-agent/packages/database/src/storage.service.ts)) configured for S3-compatible object storage (Neon Storage, Cloudflare R2, AWS S3, or Vercel Blob).

### Object Storage Directory Layout:
```text
p2d-voice-recordings/
├── recordings/
│   └── 2026/09/call_99281.mp3        # Master audio recording file (.mp3/.wav)
├── transcripts/
│   └── conv_99281.json               # Full diarized JSON transcript with timestamps
├── summaries/
│   └── conv_99281-ai-summary.json    # Structured AI intelligence analysis & actions
└── figures/
    └── 1790238-workflow-diagram.png  # Generated visual workflow charts & figures
```

### Storage Configuration in Environment Variables:
```env
OBJECT_STORAGE_BUCKET=p2d-voice-recordings
OBJECT_STORAGE_ENDPOINT=https://storage.neon.tech
OBJECT_STORAGE_PUBLIC_URL=https://assets.p2d.ai/storage
```

---

## 4. Deploying Next.js to Vercel in 3 Minutes

1. Push your code to your GitHub repository:
   `https://github.com/jogdandsainath/p2d-voice-ai-agent`
2. Open **[https://vercel.com/new](https://vercel.com/new)** and import the repository.
3. In **Project Settings**:
   - **Framework Preset:** Next.js
   - **Root Directory:** `apps/web` (or `./` with workspace)
4. Add the following **Environment Variables** in Vercel:

| Variable | Value / Example |
|---|---|
| `DATABASE_URL` | `postgresql://neondb_owner:...@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require` |
| `JWT_SECRET` | `K8vX9mQ2zL5pT7wR4yN1jF6hC3bV8dG0sA4xE9uI2oM=` |
| `ENCRYPTION_KEY` | `9f8e7d6c5b4a3928172635445566778899aabbccddeeff001122334455667788` |
| `GEMINI_API_KEY` | `AIzaSy...` (from [Google AI Studio](https://aistudio.google.com/app/apikey)) |
| `ANTHROPIC_API_KEY` | `sk-ant-...` (optional, for Claude) |
| `OPENAI_API_KEY` | `sk-proj-...` (optional) |
| `ELEVENLABS_API_KEY` | `sk_...` (from [ElevenLabs](https://elevenlabs.io)) |
| `TWILIO_ACCOUNT_SID` | `AC...` (from [Twilio](https://console.twilio.com)) |
| `TWILIO_AUTH_TOKEN` | `tw_token_...` |
| `OBJECT_STORAGE_BUCKET` | `p2d-voice-recordings` |
| `OBJECT_STORAGE_ENDPOINT`| `https://storage.neon.tech` |

5. Click **Deploy**. Vercel will build and assign your production URL (e.g. `https://p2d-voice-ai-agent.vercel.app`).

---

## 5. Live Single Call Test Execution

To verify everything end-to-end (including object storage uploads, AI reasoning, and workflow execution):

```bash
npm run test:call
```
