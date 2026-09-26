import { VoiceProvider } from './voice.provider.js';
import { VoiceMetadata, VoiceSettings, logger } from '@p2d/shared';

export class CartesiaVoiceAdapter implements VoiceProvider {
  public readonly providerName = 'cartesia' as const;
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.CARTESIA_API_KEY || 'mock_cartesia_key';
  }

  async getVoices(): Promise<VoiceMetadata[]> {
    return [
      {
        id: 'cartesia_sonic_sarah',
        name: 'Sarah (Cartesia Sonic Ultra-Fast)',
        provider: 'cartesia' as any,
        language: 'en-US',
        gender: 'female',
        category: 'standard',
        previewUrl: 'https://assets.p2d.ai/voices/cartesia_sarah.mp3',
      },
      {
        id: 'cartesia_sonic_david',
        name: 'David (Cartesia Sonic Executive)',
        provider: 'cartesia' as any,
        language: 'en-US',
        gender: 'male',
        category: 'standard',
        previewUrl: 'https://assets.p2d.ai/voices/cartesia_david.mp3',
      },
    ];
  }

  async synthesize(text: string, voiceId: string, settings?: VoiceSettings): Promise<Buffer> {
    logger.info('Synthesizing speech via Cartesia Sonic (Sub-100ms Latency)', {
      voiceId,
      textLength: text.length,
    });
    return Buffer.from('CARTESIA_SONIC_PCM_AUDIO_' + text);
  }

  async previewVoice(voiceId: string, sampleText = 'Hello! This is Cartesia Sonic real-time voice.'): Promise<Buffer> {
    return this.synthesize(sampleText, voiceId);
  }
}
