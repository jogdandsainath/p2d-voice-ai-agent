# ADR-008: Security & Secret Encryption Vault

## Status
Accepted

## Context
Third-party credentials (API keys, telephony auth tokens, OAuth access tokens, webhook signing secrets) must never be stored in plaintext.

## Decision
Implement an AES-256-GCM symmetric encryption service in `@p2d/auth`.
1. Every stored secret generates a unique 16-byte initialization vector (IV) and a 16-byte authentication tag.
2. The encryption key is supplied via the `ENCRYPTION_KEY` environment variable.
3. Database queries return encrypted blobs; secrets are decrypted in memory strictly at the point of execution.

## Consequences
- **Pros:** Robust encryption at rest; tamper detection via GCM auth tags; protection against database dump leaks.
- **Cons:** Loss of the master encryption key renders encrypted credentials unrecoverable.
