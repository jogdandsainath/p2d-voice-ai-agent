import { VoiceProvider } from './voice.provider.js';
import { VoiceMetadata, VoiceSettings, logger } from '@p2d/shared';

export class OpenAIVoiceAdapter implements VoiceProvider {
  public readonly providerName = 'openai' as const;
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || 'mock_openai_key';
  }

  async getVoices(): Promise<VoiceMetadata[]> {
    return [
      { id: 'alloy', name: 'Alloy', provider: 'openai', language: 'en-US', gender: 'neutral', category: 'standard' },
      { id: 'echo', name: 'Echo', provider: 'openai', language: 'en-US', gender: 'male', category: 'standard' },
      { id: 'fable', name: 'Fable', provider: 'openai', language: 'en-US', gender: 'neutral', category: 'standard' },
      { id: 'onyx', name: 'Onyx', provider: 'openai', language: 'en-US', gender: 'male', category: 'standard' },
      { id: 'nova', name: 'Nova', provider: 'openai', language: 'en-US', gender: 'female', category: 'standard' },
      { id: 'shimmer', name: 'Shimmer', provider: 'openai', language: 'en-US', gender: 'female', category: 'standard' },
    ];
  }

  async synthesize(text: string, voiceId: string, settings?: VoiceSettings): Promise<Buffer> {
    logger.info('Synthesizing speech via OpenAI TTS', { voiceId, textLength: text.length });
    return Buffer.from('OPENAI_TTS_AUDIO_' + text);
  }

  async previewVoice(voiceId: string, sampleText = 'Welcome to Pur2Divin Voice AI.'): Promise<Buffer> {
    return this.synthesize(sampleText, voiceId);
  }
}
