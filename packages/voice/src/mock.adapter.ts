import { VoiceProvider } from './voice.provider';
import { VoiceMetadata, VoiceSettings, logger } from '@p2d/shared';

export class MockVoiceAdapter implements VoiceProvider {
  public readonly providerName = 'mock' as const;

  async getVoices(): Promise<VoiceMetadata[]> {
    return [
      { id: 'mock_rachel', name: 'Rachel (Simulated SDR)', provider: 'mock', language: 'en-US', gender: 'female', category: 'standard' },
      { id: 'mock_domi', name: 'Domi (Simulated Outbound)', provider: 'mock', language: 'en-US', gender: 'female', category: 'standard' },
      { id: 'mock_antoni', name: 'Antoni (Simulated Exec)', provider: 'mock', language: 'en-US', gender: 'male', category: 'standard' },
    ];
  }

  async synthesize(text: string, voiceId: string, settings?: VoiceSettings): Promise<Buffer> {
    logger.info('[Simulator] Synthesizing speech mock audio', { voiceId, text });
    return Buffer.from('RIFF_MOCK_WAV_AUDIO_' + text);
  }

  async previewVoice(voiceId: string, sampleText = 'This is a simulator test preview.'): Promise<Buffer> {
    return this.synthesize(sampleText, voiceId);
  }
}
