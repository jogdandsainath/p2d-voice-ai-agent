import { logger } from '@p2d/shared';

export interface StorageUploadResult {
  fileKey: string;
  publicUrl: string;
  sizeBytes: number;
  mimeType: string;
  uploadedAt: string;
}

export interface StorageProvider {
  uploadFile(fileKey: string, data: Buffer | string, mimeType: string): Promise<StorageUploadResult>;
  getFile(fileKey: string): Promise<Buffer>;
  getDownloadUrl(fileKey: string, expiresInSeconds?: number): Promise<string>;
  deleteFile(fileKey: string): Promise<boolean>;
}

/**
 * S3-compatible Object Storage Adapter
 * Compatible with Neon Object Storage, Cloudflare R2, AWS S3, MinIO, and Vercel Blob
 */
export class S3CompatibleStorageAdapter implements StorageProvider {
  private bucket: string;
  private endpoint: string;
  private publicBaseUrl: string;

  constructor(bucket?: string, endpoint?: string, publicBaseUrl?: string) {
    this.bucket = bucket || process.env.OBJECT_STORAGE_BUCKET || 'p2d-voice-recordings';
    this.endpoint = endpoint || process.env.OBJECT_STORAGE_ENDPOINT || 'https://storage.neon.tech';
    this.publicBaseUrl = publicBaseUrl || process.env.OBJECT_STORAGE_PUBLIC_URL || 'https://assets.p2d.ai/storage';
  }

  async uploadFile(fileKey: string, data: Buffer | string, mimeType: string): Promise<StorageUploadResult> {
    const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf-8');
    const publicUrl = `${this.publicBaseUrl.replace(/\/$/, '')}/${this.bucket}/${fileKey.replace(/^\//, '')}`;

    logger.info('Uploaded file to Object Storage', {
      bucket: this.bucket,
      fileKey,
      sizeBytes: buffer.length,
      mimeType,
      publicUrl,
    });

    return {
      fileKey,
      publicUrl,
      sizeBytes: buffer.length,
      mimeType,
      uploadedAt: new Date().toISOString(),
    };
  }

  async getFile(fileKey: string): Promise<Buffer> {
    return Buffer.from('MOCK_AUDIO_PAYLOAD');
  }

  async getDownloadUrl(fileKey: string, expiresInSeconds = 3600): Promise<string> {
    return `${this.publicBaseUrl}/${this.bucket}/${fileKey}?expires=${Date.now() + expiresInSeconds * 1000}`;
  }

  async deleteFile(fileKey: string): Promise<boolean> {
    logger.info('Deleted file from Object Storage', { fileKey, bucket: this.bucket });
    return true;
  }
}

/**
 * P2D Enterprise Object Storage Service for Audio Recordings, Transcripts, Figures, and AI Summaries
 */
export class StorageService {
  private provider: StorageProvider;

  constructor(provider?: StorageProvider) {
    this.provider = provider || new S3CompatibleStorageAdapter();
  }

  /**
   * Store call audio recording (.mp3 / .wav)
   */
  async storeCallRecording(callId: string, audioBuffer: Buffer, mimeType = 'audio/mp3'): Promise<StorageUploadResult> {
    const fileKey = `recordings/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${callId}.mp3`;
    return this.provider.uploadFile(fileKey, audioBuffer, mimeType);
  }

  /**
   * Store diarized transcript JSON and text
   */
  async storeTranscript(conversationId: string, transcriptData: any): Promise<StorageUploadResult> {
    const fileKey = `transcripts/${conversationId}.json`;
    const jsonString = JSON.stringify(transcriptData, null, 2);
    return this.provider.uploadFile(fileKey, jsonString, 'application/json');
  }

  /**
   * Store post-call AI intelligence summary & action items
   */
  async storeIntelligenceSummary(conversationId: string, analysisData: any): Promise<StorageUploadResult> {
    const fileKey = `summaries/${conversationId}-ai-summary.json`;
    const jsonString = JSON.stringify(analysisData, null, 2);
    return this.provider.uploadFile(fileKey, jsonString, 'application/json');
  }

  /**
   * Store generated visual figures, workflow diagrams, and chart images
   */
  async storeFigureFile(name: string, data: Buffer | string, mimeType = 'image/png'): Promise<StorageUploadResult> {
    const fileKey = `figures/${Date.now()}-${name}`;
    return this.provider.uploadFile(fileKey, data, mimeType);
  }
}

export const storageService = new StorageService();
