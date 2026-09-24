export * from './llm.provider.js';
export * from './openai.provider.js';
export * from './gemini.provider.js';
export * from './mock.provider.js';
export * from './conversation-engine.js';
export * from './intelligence-analyzer.js';

import { LLMProvider } from './llm.provider.js';
import { OpenAIProvider } from './openai.provider.js';
import { GeminiProvider } from './gemini.provider.js';
import { MockLLMProvider } from './mock.provider.js';

export class LLMFactory {
  static getProvider(providerName = 'gemini', modelName?: string): LLMProvider {
    switch (providerName.toLowerCase()) {
      case 'gemini':
      case 'google':
        return new GeminiProvider(undefined, modelName || 'gemini-1.5-flash');
      case 'openai':
        return new OpenAIProvider();
      case 'mock':
      default:
        return new MockLLMProvider();
    }
  }
}
