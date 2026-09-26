export * from './llm.provider.js';
export * from './openai.provider.js';
export * from './gemini.provider.js';
export * from './anthropic.provider.js';
export * from './groq.provider.js';
export * from './ollama.provider.js';
export * from './mock.provider.js';
export * from './conversation-engine.js';
export * from './intelligence-analyzer.js';

import { LLMProvider } from './llm.provider.js';
import { OpenAIProvider } from './openai.provider.js';
import { GeminiProvider } from './gemini.provider.js';
import { AnthropicProvider } from './anthropic.provider.js';
import { GroqProvider } from './groq.provider.js';
import { OllamaProvider } from './ollama.provider.js';
import { MockLLMProvider } from './mock.provider.js';

export class LLMFactory {
  static getProvider(providerName = 'gemini', modelName?: string): LLMProvider {
    switch (providerName.toLowerCase()) {
      case 'gemini':
      case 'google':
        return new GeminiProvider(undefined, modelName || 'gemini-1.5-flash');
      case 'claude':
      case 'anthropic':
        return new AnthropicProvider(undefined, modelName || 'claude-3-5-sonnet-20241022');
      case 'openai':
        return new OpenAIProvider();
      case 'groq':
        return new GroqProvider(undefined, modelName || 'llama-3.3-70b-versatile');
      case 'ollama':
        return new OllamaProvider(undefined, modelName || 'llama3.2');
      case 'mock':
      default:
        return new MockLLMProvider();
    }
  }
}
