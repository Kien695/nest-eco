import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import envConfig from '../config';
import { payloadToken } from '../types/jwt.type';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  accessToken(payload: { userId: number }) {
    return this.jwtService.sign(payload, {
      secret: envConfig.ACCESS_TOKEN_SECRET,
      expiresIn: envConfig.ACCESS_TOKEN_EXPIRED as any,
    });
  }
  refreshToken(payload: { userId: number }) {
    return this.jwtService.sign(payload, {
      secret: envConfig.REFRESH_TOKEN_SECRET,
      expiresIn: envConfig.REFRESH_TOKEN_EXPIRED as any,
    });
  }
  verifyAccessToken(token: string): Promise<payloadToken> {
    return this.jwtService.verifyAsync(token, {
      secret: envConfig.ACCESS_TOKEN_SECRET,
    });
  }
  verifyRefreshToken(token: string): Promise<payloadToken> {
    return this.jwtService.verifyAsync(token, {
      secret: envConfig.REFRESH_TOKEN_SECRET,
    });
  }
}
