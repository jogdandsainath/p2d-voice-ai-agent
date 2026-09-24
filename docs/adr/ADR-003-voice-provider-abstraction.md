# ADR-003: Voice Provider Abstraction (TTS & STT)

## Status
Accepted

## Context
Voice synthesis and speech recognition technologies evolve rapidly. ElevenLabs provides state-of-the-art voice cloning and streaming synthesis; OpenAI provides multimodal voice capabilities; Cartesia and Deepgram offer ultra-low latency alternatives.

## Decision
Define `VoiceProvider` in `@p2d/voice`. Implement `ElevenLabsVoiceAdapter`, `OpenAIVoiceAdapter`, and `MockVoiceAdapter`. The conversation engine receives audio stream chunks independently of the provider backend.

## Consequences
- **Pros:** Prevents vendor lock-in; allows benchmarking voice latency across vendors and running local tests with mock audio.
- **Cons:** Feature parity (e.g. style exaggeration) requires optional metadata flags.
