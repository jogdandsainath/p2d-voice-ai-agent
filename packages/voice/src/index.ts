export * from './voice.provider.js';
export * from './elevenlabs.adapter.js';
export * from './openai.adapter.js';
export * from './mock.adapter.js';

import { VoiceProvider } from './voice.provider.js';
import { ElevenLabsVoiceAdapter } from './elevenlabs.adapter.js';
import { OpenAIVoiceAdapter } from './openai.adapter.js';
import { MockVoiceAdapter } from './mock.adapter.js';

export class VoiceFactory {
  static getProvider(providerName: string): VoiceProvider {
    switch (providerName) {
      case 'elevenlabs':
        return new ElevenLabsVoiceAdapter();
      case 'openai':
        return new OpenAIVoiceAdapter();
      case 'mock':
      default:
        return new MockVoiceAdapter();
    }
  }
}
