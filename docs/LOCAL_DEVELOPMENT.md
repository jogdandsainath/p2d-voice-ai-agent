# Local Development Guide

## Project: P2D Voice AI Agent Platform

---

## 1. Prerequisites
- **Node.js:** v18.0.0 or higher (v20+ recommended)
- **npm / pnpm / yarn**
- **Docker & Docker Compose** (Optional, for running local PostgreSQL & Redis)

---

## 2. Quickstart

### 2.1 Clone & Setup Environment
```bash
cd D:\E-Divin-Agents\p2d-voice-ai-agent
cp .env.example .env
```

### 2.2 Install Dependencies
```bash
npm install
```

### 2.3 Initialize Database & Seed Demo Data
```bash
npm run db:generate
npm run db:seed
```

### 2.4 Start Development Services
```bash
# Starts API, Worker, and Next.js Web UI concurrently
npm run dev
```

The services will be available at:
- **Next.js Web UI:** `http://localhost:3000`
- **Fastify API Server:** `http://localhost:4000`
- **API Swagger / Docs:** `http://localhost:4000/docs`
- **Health Check:** `http://localhost:4000/health`

---

## 3. Simulator Mode (No Telephony/Voice Keys Required)
The platform includes built-in mock providers (`mock_telephony`, `mock_voice`, `mock_llm`) allowing you to:
1. Test inbound and outbound calling in the browser.
2. Interact with the Live Conversation Simulator.
3. Automatically generate post-call transcripts, summaries, and action items.
4. Execute visual workflows and verify webhook dispatches locally.

---

## 4. Running Automated Tests
```bash
# Run all unit and integration tests
npm run test

# Run tests with coverage
npm run test:coverage
```
