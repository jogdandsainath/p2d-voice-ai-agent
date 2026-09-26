export * from './voice.provider.js';
export * from './elevenlabs.adapter.js';
export * from './cartesia.adapter.js';
export * from './deepgram.adapter.js';
export * from './openai.adapter.js';
export * from './mock.adapter.js';

import { VoiceProvider } from './voice.provider.js';
import { ElevenLabsVoiceAdapter } from './elevenlabs.adapter.js';
import { CartesiaVoiceAdapter } from './cartesia.adapter.js';
import { DeepgramVoiceAdapter } from './deepgram.adapter.js';
import { OpenAIVoiceAdapter } from './openai.adapter.js';
import { MockVoiceAdapter } from './mock.adapter.js';

export class VoiceFactory {
  static getProvider(providerName = 'elevenlabs'): VoiceProvider {
    switch (providerName.toLowerCase()) {
      case 'elevenlabs':
        return new ElevenLabsVoiceAdapter();
      case 'cartesia':
        return new CartesiaVoiceAdapter();
      case 'deepgram':
        return new DeepgramVoiceAdapter();
      case 'openai':
        return new OpenAIVoiceAdapter();
      case 'mock':
      default:
        return new MockVoiceAdapter();
    }
  }
}
