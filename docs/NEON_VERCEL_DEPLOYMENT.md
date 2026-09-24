# Deploying P2D Voice AI Platform to Vercel & Neon PostgreSQL

## Overview

Yes, **P2D Voice AI Agent Platform** is fully compatible with **Vercel** (for the Next.js frontend and serverless API endpoints) and **Neon PostgreSQL** (serverless, auto-scaling PostgreSQL with built-in connection pooling).

---

## 1. Architectural Architecture: Vercel + Neon DB

```mermaid
flowchart LR
    Browser["User Browser / Ops Console"] --> Vercel["Vercel Edge & Serverless<br/>(Next.js Web UI & APIs)"]
    Twilio["Telephony / Webhooks"] --> Vercel
    Vercel <--> Neon[("Neon PostgreSQL<br/>(Serverless DB + Prisma)")]
    Vercel --> ElevenLabs["ElevenLabs Voice API"]
    Vercel --> OpenAI["OpenAI LLM API"]
    Vercel --> P2D_CC["P2D Command Center"]
```

---

## 2. Step-by-Step Deployment Guide

### Step 1: Create a Neon Database
1. Go to [https://neon.tech](https://neon.tech) and create a free project named `p2d-voice-ai`.
2. In the Neon Dashboard, copy your connection string:
   ```text
   DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
   DIRECT_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-sample.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```

### Step 2: Push Database Schema to Neon
From your local project root:
```bash
# Set your Neon DATABASE_URL
export DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Push schema directly to Neon DB
npm run db:push
```

### Step 3: Deploy to Vercel
1. Go to [https://vercel.com/new](https://vercel.com/new) and import repository:
   `https://github.com/jogdandsainath/p2d-voice-ai-agent`
2. Set **Root Directory** to `apps/web` (or root with monorepo build).
3. Under **Environment Variables**, add:
   - `DATABASE_URL`: Your Neon connection string
   - `JWT_SECRET`: A secure 32+ character string
   - `ENCRYPTION_KEY`: A 32-byte hex string (64 characters)
   - `ELEVENLABS_API_KEY`: Your ElevenLabs API key
   - `TWILIO_ACCOUNT_SID`: Your Twilio Account SID
   - `TWILIO_AUTH_TOKEN`: Your Twilio Auth Token
   - `OPENAI_API_KEY`: Your OpenAI API key
4. Click **Deploy**.

---

## 3. Testing a Single End-to-End Call Locally or in Cloud

You can test a complete live call anytime using the built-in single call runner:

```bash
npm run test:call
```

This single command executes:
1. Inbound call initiation on phone line `+1 (415) 555-2671`
2. AI greeting synthesis via Rachel voice
3. Multi-turn conversation with caller Vikram (Apex Logistics)
4. Runtime Tool Invocation (`check_calendar_availability`)
5. Call recording and hangup
6. Post-call AI Intelligence extraction (Summary, Intent: `demo_request`, Outcome: `qualified_lead`, Contact details)
7. Visual Workflow execution (CRM Lead creation & Webhook dispatch)
8. Signed P2D Command Center event dispatch (`conversation.completed`)
