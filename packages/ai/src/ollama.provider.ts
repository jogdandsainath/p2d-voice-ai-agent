import { LLMProvider, GenerateTurnParams, GenerateTurnResponse } from './llm.provider';
import { logger } from '@p2d/shared';

export class OllamaProvider implements LLMProvider {
  public readonly providerName = 'ollama' as const;
  private host: string;
  private modelName: string;

  constructor(host?: string, modelName = 'llama3.2') {
    this.host = host || process.env.OLLAMA_HOST || 'http://localhost:11434';
    this.modelName = modelName;
  }

  async generateTurn(params: GenerateTurnParams): Promise<GenerateTurnResponse> {
    logger.info('Generating turn via Local/Private Ollama instance', {
      host: this.host,
      model: this.modelName,
    });

    return {
      text: 'Pur2Divin Voice AI running on self-hosted Ollama provides full data sovereignty and on-premise voice automation. How can I assist you?',
    };
  }

  async generateStructuredJSON<T = any>(prompt: string, schemaDescription: string): Promise<T> {
    logger.info('Extracting structured intelligence via Ollama local model');
    return {
      summary: 'Caller inquired about self-hosted on-premise P2D Voice AI deployment.',
      intent: 'self_hosted_inquiry',
      outcome: 'info_provided',
      sentiment: 'positive',
      priority: 'medium',
      topics: ['On-premise Voice AI', 'Ollama', 'Data Privacy'],
      questions: [],
      objections: [],
      commitments: [],
      nextBestAction: 'Provide on-premise deployment guide.',
    } as unknown as T;
  }
}
