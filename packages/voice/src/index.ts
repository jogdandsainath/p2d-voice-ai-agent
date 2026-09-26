export * from './voice.provider';
export * from './elevenlabs.adapter';
export * from './cartesia.adapter';
export * from './deepgram.adapter';
export * from './openai.adapter';
export * from './mock.adapter';

import { VoiceProvider } from './voice.provider';
import { ElevenLabsVoiceAdapter } from './elevenlabs.adapter';
import { CartesiaVoiceAdapter } from './cartesia.adapter';
import { DeepgramVoiceAdapter } from './deepgram.adapter';
import { OpenAIVoiceAdapter } from './openai.adapter';
import { MockVoiceAdapter } from './mock.adapter';

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
