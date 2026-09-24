export interface VoiceSettings {
  stability?: number;
  similarityBoost?: number;
  speed?: number;
  style?: number;
  speakerBoost?: boolean;
}

export interface VoiceMetadata {
  id: string;
  name: string;
  provider: 'elevenlabs' | 'openai' | 'cartesia' | 'mock';
  language: string;
  gender: 'male' | 'female' | 'neutral';
  previewUrl?: string;
  category: 'standard' | 'cloned' | 'custom';
}

export interface AudioChunk {
  data: Buffer | Uint8Array;
  mimeType: string;
  sequence: number;
  isFinal: boolean;
}
