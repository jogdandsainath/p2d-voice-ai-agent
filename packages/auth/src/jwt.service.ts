import jwt from 'jsonwebtoken';
import { JWTPayload, UnauthorizedError } from '@p2d/shared';

const DEFAULT_SECRET = 'p2d_dev_jwt_secret_must_be_at_least_32_chars_long_123456';

export class JwtService {
  private secret: string;
  private expiresIn: string;

  constructor(secret?: string, expiresIn = '7d') {
    this.secret = secret || process.env.JWT_SECRET || DEFAULT_SECRET;
    this.expiresIn = expiresIn;
  }

  sign(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn as any,
    });
  }

  verify(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, this.secret) as JWTPayload;
      return decoded;
    } catch (err: any) {
      throw new UnauthorizedError('Invalid or expired authentication token');
    }
  }
}

export const jwtService = new JwtService();
