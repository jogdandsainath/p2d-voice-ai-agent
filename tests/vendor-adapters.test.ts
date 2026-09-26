import { describe, it, expect } from 'vitest';
import { LLMFactory, AnthropicProvider, GeminiProvider, GroqProvider, OllamaProvider } from '../packages/ai/src/index';
import { VoiceFactory, CartesiaVoiceAdapter, DeepgramVoiceAdapter } from '../packages/voice/src/index';
import { TelephonyFactory, PlivoTelephonyAdapter } from '../packages/telephony/src/index';

describe('Multi-Vendor Adapter Suite (Gemini, Claude, OpenAI, Groq, Cartesia, Deepgram, Plivo)', () => {
  // 1. LLM Vendor Factory
  describe('LLM Providers', () => {
    it('should resolve GeminiProvider via LLMFactory', () => {
      const gemini = LLMFactory.getProvider('gemini');
      expect(gemini.providerName).toBe('gemini');
    });

    it('should resolve Anthropic Claude provider via LLMFactory', () => {
      const claude = LLMFactory.getProvider('claude');
      expect(claude.providerName).toBe('anthropic');
    });

    it('should resolve Groq provider via LLMFactory', () => {
      const groq = LLMFactory.getProvider('groq');
      expect(groq.providerName).toBe('groq');
    });

    it('should resolve Ollama local provider via LLMFactory', () => {
      const ollama = LLMFactory.getProvider('ollama');
      expect(ollama.providerName).toBe('ollama');
    });

    it('AnthropicProvider should generate conversational turn and structured JSON', async () => {
      const claude = new AnthropicProvider();
      const turn = await claude.generateTurn({
        messages: [{ role: 'user', content: 'Hi, I would like to schedule a demo on Tuesday.' }],
        systemPrompt: 'You are an SDR.',
      });

      expect(turn.text).toBeDefined();
      expect(turn.toolCalls).toBeDefined();
      expect(turn.toolCalls?.[0].name).toBe('check_calendar_availability');

      const analysis = await claude.generateStructuredJSON('sample transcript', 'analysis');
      expect(analysis.intent).toBe('demo_request');
      expect(analysis.outcome).toBe('qualified_lead');
    });

    it('GeminiProvider should generate turn and extract structured intelligence', async () => {
      const gemini = new GeminiProvider();
      const turn = await gemini.generateTurn({
        messages: [{ role: 'user', content: 'Can we book a product demo?' }],
        systemPrompt: 'You are an admissions advisor.',
      });

      expect(turn.text).toBeDefined();
      expect(turn.toolCalls).toBeDefined();

      const json = await gemini.generateStructuredJSON('transcript', 'schema');
      expect(json.intent).toBe('demo_request');
    });
  });

  // 2. Voice Vendor Factory
  describe('Voice Providers', () => {
    it('should resolve Cartesia Voice Adapter via VoiceFactory', async () => {
      const cartesia = VoiceFactory.getProvider('cartesia');
      expect(cartesia.providerName).toBe('cartesia');
      const voices = await cartesia.getVoices();
      expect(voices.length).toBeGreaterThan(0);
      expect(voices[0].name).toContain('Cartesia');

      const audio = await cartesia.synthesize('Hello from Cartesia Sonic', 'cartesia_sonic_sarah');
      expect(Buffer.isBuffer(audio)).toBe(true);
    });

    it('should resolve Deepgram Aura Adapter via VoiceFactory', async () => {
      const deepgram = VoiceFactory.getProvider('deepgram');
      expect(deepgram.providerName).toBe('deepgram');
      const voices = await deepgram.getVoices();
      expect(voices.length).toBeGreaterThan(0);
      expect(voices[0].name).toContain('Deepgram');

      const audio = await deepgram.synthesize('Hello from Deepgram Aura', 'aura-asteria-en');
      expect(Buffer.isBuffer(audio)).toBe(true);
    });
  });

  // 3. Telephony Vendor Factory
  describe('Telephony Providers', () => {
    it('should resolve Plivo Telephony Adapter via TelephonyFactory', async () => {
      const plivo = TelephonyFactory.getProvider('plivo');
      expect(plivo).toBeDefined();

      const call = await plivo.initiateCall({
        to: '+14155559876',
        from: '+14155552671',
        agentId: 'agent_01',
        conversationId: 'conv_01',
        webhookUrl: 'http://localhost/webhook',
        statusCallbackUrl: 'http://localhost/status',
      });

      expect(call.callSid).toContain('PLIVO');
    });
  });
});
