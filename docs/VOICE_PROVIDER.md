# Voice & Audio AI Architecture

## Project: P2D Voice AI Agent Platform
**Document Version:** 1.0.0  
**Scope:** Voice AI Adapters, TTS, STT, Streaming Pipeline  

---

## 1. The `VoiceProvider` Interface

The platform decouples voice synthesis and speech recognition through the `VoiceProvider` interface:

```typescript
export interface VoiceSettings {
  stability?: number;       // 0.0 - 1.0
  similarityBoost?: number; // 0.0 - 1.0
  speed?: number;           // 0.5 - 2.0
  style?: number;           // 0.0 - 1.0
  speakerBoost?: boolean;
}

export interface VoiceMetadata {
  id: string;
  name: string;
  provider: string;
  language: string;
  gender: 'male' | 'female' | 'neutral';
  previewUrl?: string;
  category: 'standard' | 'cloned' | 'custom';
}

export interface VoiceProvider {
  readonly providerName: string;

  getVoices(): Promise<VoiceMetadata[]>;
  synthesize(text: string, voiceId: string, settings?: VoiceSettings): Promise<Buffer>;
  synthesizeStream(text: string, voiceId: string, settings?: VoiceSettings): Promise<NodeJS.ReadableStream>;
  previewVoice(voiceId: string, sampleText?: string): Promise<Buffer>;
}
```

---

## 2. Voice Provider Adapters

### 2.1 ElevenLabs Voice Adapter (`ElevenLabsVoiceAdapter`)
- High-fidelity streaming audio synthesis using ElevenLabs Turbo v2.5 / Multilingual v2 models.
- Sub-250ms time-to-first-audio-chunk via WebSocket streaming.
- Supports fine-grained controls (stability, similarity boost, style exaggeration).

### 2.2 OpenAI Audio Adapter (`OpenAIVoiceAdapter`)
- Text-to-Speech integration via `tts-1` / `tts-1-hd` endpoints and Realtime Audio API.
- Standard built-in voices: `alloy`, `echo`, `fable`, `onyx`, `nova`, `shimmer`.

### 2.3 Simulator / Web Audio Adapter (`MockVoiceAdapter`)
- In-memory / test synthesizer that produces standard test PCM / WAV audio buffers for unit testing and local development without consuming ElevenLabs character quotas.

---

## 3. Speech-to-Text & Barge-In (Interruptibility)
- Real-time speech recognition decodes incoming caller audio stream chunks with Voice Activity Detection (VAD).
- If caller speech activity is detected while the agent is speaking:
  1. An immediate `CLEAR_BUFFER` event is sent to the telephony audio stream.
  2. The TTS generation task is cancelled.
  3. The Conversation Engine resets its turn and processes the caller's interruption seamlessly.
