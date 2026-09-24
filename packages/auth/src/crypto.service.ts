import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const DEFAULT_KEY_HEX = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

export interface EncryptedData {
  encryptedData: string; // hex
  iv: string;            // hex
  authTag: string;       // hex
}

export class CryptoService {
  private key: Buffer;

  constructor(keyHex?: string) {
    const rawKey = keyHex || process.env.ENCRYPTION_KEY || DEFAULT_KEY_HEX;
    this.key = Buffer.from(rawKey.padEnd(64, '0').slice(0, 64), 'hex');
  }

  encrypt(plainText: string): EncryptedData {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, this.key, iv);
    
    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');

    return {
      encryptedData: encrypted,
      iv: iv.toString('hex'),
      authTag,
    };
  }

  decrypt(encryptedData: string, ivHex: string, authTagHex: string): string {
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, this.key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}

export const cryptoService = new CryptoService();
