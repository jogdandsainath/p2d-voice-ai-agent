# Contributing Guidelines

## Project: P2D Voice AI Agent Platform

Thank you for contributing to P2D Voice AI Agent Platform. To maintain code quality and enterprise standards, please adhere to these guidelines.

---

## 1. Development Principles
- **Clean Architecture:** Keep domain logic isolated from external frameworks and carrier libraries.
- **Provider Abstractions:** Never invoke third-party APIs (Twilio, ElevenLabs, OpenAI) directly in controllers; always interact via the appropriate Port/Interface (`TelephonyProvider`, `VoiceProvider`, `LLMProvider`).
- **Strict Typing:** No implicit `any`. Use canonical DTOs from `@p2d/shared`.
- **Testing:** Every feature must include unit tests and, where applicable, integration/simulation tests.

---

## 2. Pull Request Workflow
1. Branch naming: `feat/<feature-name>`, `fix/<bug-name>`, `docs/<topic>`.
2. Ensure `npm run lint`, `npm run typecheck`, and `npm run test` pass cleanly.
3. Keep commits semantic (`feat: ...`, `fix: ...`, `docs: ...`, `test: ...`).
