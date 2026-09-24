import { describe, it, expect } from 'vitest';
import { CryptoService } from '../packages/auth/src/crypto.service.js';

describe('AES-256-GCM CryptoService Vault', () => {
  const cryptoService = new CryptoService();

  it('should encrypt and decrypt secrets without data corruption', () => {
    const plainSecret = 'sk_live_elevenlabs_prod_1234567890abcdef';
    const encrypted = cryptoService.encrypt(plainSecret);

    expect(encrypted.encryptedData).toBeDefined();
    expect(encrypted.iv).toBeDefined();
    expect(encrypted.authTag).toBeDefined();

    const decrypted = cryptoService.decrypt(
      encrypted.encryptedData,
      encrypted.iv,
      encrypted.authTag
    );

    expect(decrypted).toBe(plainSecret);
  });

  it('should fail decryption if authTag or ciphertext is tampered', () => {
    const plainSecret = 'secret_password_123';
    const encrypted = cryptoService.encrypt(plainSecret);

    // Tamper with ciphertext
    const tamperedData = encrypted.encryptedData.slice(0, -2) + 'aa';

    expect(() => {
      cryptoService.decrypt(tamperedData, encrypted.iv, encrypted.authTag);
    }).toThrowError();
  });
});
