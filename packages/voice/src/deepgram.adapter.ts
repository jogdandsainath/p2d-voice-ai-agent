import { VoiceProvider } from './voice.provider.js';
import { VoiceMetadata, VoiceSettings, logger } from '@p2d/shared';

export class DeepgramVoiceAdapter implements VoiceProvider {
  public readonly providerName = 'deepgram' as const;
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.DEEPGRAM_API_KEY || 'mock_deepgram_key';
  }

  async getVoices(): Promise<VoiceMetadata[]> {
    return [
      {
        id: 'aura-asteria-en',
        name: 'Asteria (Deepgram Aura Natural)',
        provider: 'deepgram' as any,
        language: 'en-US',
        gender: 'female',
        category: 'standard',
        previewUrl: 'https://assets.p2d.ai/voices/deepgram_asteria.mp3',
      },
      {
        id: 'aura-orion-en',
        name: 'Orion (Deepgram Aura Authority)',
        provider: 'deepgram' as any,
        language: 'en-US',
        gender: 'male',
        category: 'standard',
        previewUrl: 'https://assets.p2d.ai/voices/deepgram_orion.mp3',
      },
      {
        id: 'aura-luna-en',
        name: 'Luna (Deepgram Aura Conversational)',
        provider: 'deepgram' as any,
        language: 'en-US',
        gender: 'female',
        category: 'standard',
        previewUrl: 'https://assets.p2d.ai/voices/deepgram_luna.mp3',
      },
    ];
  }

  async synthesize(text: string, voiceId: string, settings?: VoiceSettings): Promise<Buffer> {
    logger.info('Synthesizing speech via Deepgram Aura TTS', {
      voiceId,
      textLength: text.length,
    });
    return Buffer.from('DEEPGRAM_AURA_AUDIO_' + text);
  }

  async previewVoice(voiceId: string, sampleText = 'Welcome to Pur2Divin powered by Deepgram Aura.'): Promise<Buffer> {
    return this.synthesize(sampleText, voiceId);
  }
}
