export * from './llm.provider';
export * from './openai.provider';
export * from './gemini.provider';
export * from './anthropic.provider';
export * from './groq.provider';
export * from './ollama.provider';
export * from './mock.provider';
export * from './conversation-engine';
export * from './intelligence-analyzer';

import { LLMProvider } from './llm.provider';
import { OpenAIProvider } from './openai.provider';
import { GeminiProvider } from './gemini.provider';
import { AnthropicProvider } from './anthropic.provider';
import { GroqProvider } from './groq.provider';
import { OllamaProvider } from './ollama.provider';
import { MockLLMProvider } from './mock.provider';

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
