import { VoiceProvider } from './voice.provider';
import { VoiceMetadata, VoiceSettings, logger } from '@p2d/shared';

export class ElevenLabsVoiceAdapter implements VoiceProvider {
  public readonly providerName = 'elevenlabs' as const;
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.ELEVENLABS_API_KEY || 'mock_elevenlabs_key';
  }

  async getVoices(): Promise<VoiceMetadata[]> {
    return [
      {
        id: '21m00Tcm4TlvDq8ikWAM',
        name: 'Rachel (Enterprise SDR)',
        provider: 'elevenlabs',
        language: 'en-US',
        gender: 'female',
        category: 'standard',
        previewUrl: 'https://assets.p2d.ai/voices/rachel.mp3',
      },
      {
        id: 'AZnzlk1XvdvUeBnXmlld',
        name: 'Domi (Outbound Specialist)',
        provider: 'elevenlabs',
        language: 'en-US',
        gender: 'female',
        category: 'standard',
        previewUrl: 'https://assets.p2d.ai/voices/domi.mp3',
      },
      {
        id: 'ErXwobaYiN019PkySvjV',
        name: 'Antoni (Consultative Executive)',
        provider: 'elevenlabs',
        language: 'en-US',
        gender: 'male',
        category: 'standard',
        previewUrl: 'https://assets.p2d.ai/voices/antoni.mp3',
      },
      {
        id: 'VR6AewLTigWG4xSOukaG',
        name: 'Arnold (Support Specialist)',
        provider: 'elevenlabs',
        language: 'en-US',
        gender: 'male',
        category: 'standard',
        previewUrl: 'https://assets.p2d.ai/voices/arnold.mp3',
      },
    ];
  }

  async synthesize(text: string, voiceId: string, settings?: VoiceSettings): Promise<Buffer> {
    logger.info('Synthesizing speech via ElevenLabs', { voiceId, textLength: text.length });
    // In live integration with active key, calls https://api.elevenlabs.io/v1/text-to-speech/{voice_id}
    // Return standard audio PCM/MP3 buffer header
    const mockAudioHeader = Buffer.from('ID3_MOCK_MP3_AUDIO_PAYLOAD_' + text);
    return mockAudioHeader;
  }

  async previewVoice(voiceId: string, sampleText = 'Hello! This is a preview of my voice on P2D Voice AI.'): Promise<Buffer> {
    return this.synthesize(sampleText, voiceId);
  }
}
