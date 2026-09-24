# Security & Compliance Specification

## Project: P2D Voice AI Agent Platform
**Document Version:** 1.0.0  
**Security Classification:** Enterprise Confidential  

---

## 1. Authentication & Session Management
1. **Stateless JWT Tokens:** User sessions are verified using signed JSON Web Tokens (HMAC-SHA256 or RS256). Tokens carry `sub` (User ID), `org` (Organization ID), and `role` claims with strict expiration (1 hour access, 7-day refresh).
2. **API Keys:** Automated external systems and telephony gateways use cryptographically random API keys formatted as `p2d_live_<32_random_bytes>`. Keys are hashed via SHA-256 before database lookup.

---

## 2. Role-Based Access Control (RBAC)

| Role | Agent Mgmt | Telephony & Calls | Transcripts & Audio | Workflows & Integrations | Org & User Admin |
|---|---|---|---|---|---|
| **Owner** | Full | Full | Full | Full | Full (incl. billing & org deletion) |
| **Admin** | Full | Full | Full | Full | Full (user invite & role mgmt) |
| **Builder** | Create / Edit / Publish | View / Assign | View / Listen | Create / Edit Workflows | None |
| **Operator** | View / Test | Dispatch Outbound | View / Listen / Transfer | View Executions | None |
| **Analyst** | View | View Metrics | View Transcripts / Summaries | View Logs | None |
| **Viewer** | View Published | View Status | View Summaries only | None | None |

---

## 3. Cryptographic Secret Management & Encryption
1. **Encryption at Rest:** All sensitive third-party provider tokens (Twilio Auth Token, ElevenLabs API Key, CRM OAuth Tokens, Webhook secrets) are encrypted using **AES-256-GCM** before database write.
2. **Initialization Vectors & Auth Tags:** Every encrypted credential generates an individual 128-bit IV and 128-bit authentication tag. Tampered ciphertexts trigger an immediate exception upon decryption.
3. **Key Rotation:** The primary platform `ENCRYPTION_KEY` (32 bytes) is loaded exclusively from environment variables and can be rotated with re-encryption migration scripts.

---

## 4. Webhook Verification & Idempotency
1. **Inbound Webhook Verification:** Twilio webhooks are verified using the `X-Twilio-Signature` HMAC-SHA1 header against the server URL and POST parameters.
2. **Outbound Webhook Signatures:** P2D outgoing webhooks compute an HMAC-SHA256 signature using the integration secret and include it in `X-P2D-Signature: sha256=<hex_digest>` alongside `X-P2D-Timestamp`.
3. **Idempotency Control:** Inbound telephony events use the `CallSid` and `SequenceNumber` as idempotency keys in Redis/database to guarantee exactly-once processing on carrier retries.

---

## 5. Privacy, Audio Consent & Regulatory Compliance
1. **Consent Announcements:** When `recording_enabled` is active, the conversation engine automatically injects a localized disclosure message (e.g. *"This call may be recorded for quality and training purposes."*) prior to active dialogue.
2. **Retention & Deletion Lifecycle:** Configurable retention periods automatically delete or anonymize call recordings from cloud storage and remove sensitive transcripts upon expiry.
3. **Voice Cloning Guardrails:** Custom voice cloning requires explicit document verification and consent attestation from the authorized voice talent before activation.
