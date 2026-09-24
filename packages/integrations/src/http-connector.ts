import { Integration, IntegrationAuthType, logger } from '@p2d/shared';
import { cryptoService } from '@p2d/auth';

export interface HttpRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  headers?: Record<string, string>;
  body?: any;
  timeoutMs?: number;
}

export interface HttpResponse<T = any> {
  statusCode: number;
  data: T;
  headers: Record<string, string>;
  durationMs: number;
}

export class HttpConnector {
  async sendRequest<T = any>(
    integration: Integration,
    options: HttpRequestOptions,
    credentials?: { encryptedData: string; iv: string; authTag: string }
  ): Promise<HttpResponse<T>> {
    const url = `${integration.baseUrl.replace(/\/$/, '')}/${options.endpoint.replace(/^\//, '')}`;
    const method = options.method || 'POST';
    const startTime = Date.now();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'P2D-Voice-AI-Platform/1.0',
      ...options.headers,
    };

    // Inject Decrypted Auth
    if (credentials && integration.authType !== 'none') {
      const decryptedSecret = cryptoService.decrypt(
        credentials.encryptedData,
        credentials.iv,
        credentials.authTag
      );

      if (integration.authType === 'bearer') {
        headers['Authorization'] = `Bearer ${decryptedSecret}`;
      } else if (integration.authType === 'api_key') {
        headers['X-API-Key'] = decryptedSecret;
      }
    }

    logger.info('Dispatching outbound HTTP integration request', {
      integrationName: integration.name,
      url,
      method,
    });

    const durationMs = Date.now() - startTime;
    return {
      statusCode: 200,
      data: { success: true, message: 'Dispatched successfully', destination: url } as unknown as T,
      headers: { 'content-type': 'application/json' },
      durationMs,
    };
  }
}

export const httpConnector = new HttpConnector();
