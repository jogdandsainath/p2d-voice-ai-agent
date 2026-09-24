# Production Deployment Guide

## Project: P2D Voice AI Agent Platform
**Document Version:** 1.0.0  

---

## 1. Production Architecture Overview

In production, P2D Voice AI Agent runs as containerized workloads across:
- **`p2d-api`**: High-concurrency Fastify API & WebSocket Gateway handling REST endpoints and carrier media streams.
- **`p2d-worker`**: BullMQ async worker pool handling post-call AI analysis, workflow graph execution, and outgoing webhook delivery.
- **`p2d-web`**: Next.js Server-Side Rendered (SSR) / static web frontend.
- **Managed PostgreSQL**: Multi-tenant relational persistence with automated point-in-time recovery.
- **Managed Redis**: In-memory message broker and BullMQ task queue.
- **Cloud Storage (S3 / GCS)**: Encrypted storage for recorded call audio.

---

## 2. Docker & Container Deployment

### 2.1 Docker Compose Deployment
```bash
docker-compose -f infrastructure/docker-compose.prod.yml up -d
```

### 2.2 Health Check Probes
- **Liveness:** `GET http://localhost:4000/health/live` (returns `200 OK`)
- **Readiness:** `GET http://localhost:4000/health/ready` (verifies PostgreSQL and Redis connections)

---

## 3. Environment Variables Reference

| Variable | Description | Default / Example |
|---|---|---|
| `PORT` | API Server Port | `4000` |
| `DATABASE_URL` | PostgreSQL Connection String | `postgresql://user:pass@localhost:5432/p2d_voice` |
| `REDIS_URL` | Redis Connection String | `redis://localhost:6379` |
| `JWT_SECRET` | Secret key for JWT signing | `p2d_jwt_secret_change_in_prod...` |
| `ENCRYPTION_KEY` | 32-byte hex key for AES-256-GCM credentials vault | `0123456789abcdef0123456789abcdef...` |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID | `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token | `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| `ELEVENLABS_API_KEY`| ElevenLabs API Key | `sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| `OPENAI_API_KEY` | OpenAI API Key | `sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| `P2D_COMMAND_CENTER_URL` | P2D Workforce Dispatch URL | `https://command-center.p2d.ai/api/v1` |
