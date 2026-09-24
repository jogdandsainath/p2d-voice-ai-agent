# Changelog

All notable changes to the **P2D Voice AI Agent Platform** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-09-24

### Added
- **Monorepo Architecture:** Modular TypeScript packages (`@p2d/shared`, `@p2d/database`, `@p2d/telephony`, `@p2d/voice`, `@p2d/ai`, `@p2d/workflows`, `@p2d/integrations`, `@p2d/auth`).
- **Telephony Provider Abstraction:** `TelephonyProvider` interface with Twilio adapter, India PSTN/SIP gateway architectural compliance, and simulator adapter.
- **Voice Provider Abstraction:** `VoiceProvider` interface with ElevenLabs streaming voice adapter, OpenAI adapter, and mock audio synthesizer.
- **AI Orchestration & Conversation Engine:** Session state machine, turn coordinator, tool calling, context injection, and real-time simulator.
- **Post-Call Intelligence Pipeline:** Diarized transcription, executive summary, intent detection, entity extraction, sentiment analysis, action item detection, and next-best-action generation.
- **Visual Workflow Builder & Engine:** Asynchronous DAG workflow execution engine supporting Triggers, Conditions, API/Webhooks, Email, SMS, CRM, and P2D Workforce Event Bus dispatches.
- **Multi-Tenant Database & Security:** Full PostgreSQL schema with Prisma ORM, AES-256-GCM encrypted credential vault, JWT authentication, and RBAC guards.
- **Modern Next.js Web UI:** Enterprise dashboard, ElevenLabs-inspired Agent Builder, Phone Number Manager, Interactive Conversation View with audio player & transcript jumping, React Flow Workflow Canvas, Integration Manager, and Analytics.
- **Test Suite & CI/CD:** Comprehensive Vitest unit and integration test suite and GitHub Actions workflow.
