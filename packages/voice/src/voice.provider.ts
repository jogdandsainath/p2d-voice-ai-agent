import { VoiceMetadata, VoiceSettings } from '@p2d/shared';

export interface VoiceProvider {
  readonly providerName: string;

  getVoices(): Promise<VoiceMetadata[]>;
  synthesize(text: string, voiceId: string, settings?: VoiceSettings): Promise<Buffer>;
  previewVoice(voiceId: string, sampleText?: string): Promise<Buffer>;
}
