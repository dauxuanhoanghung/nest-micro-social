import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { TokenPayload } from './dto/token-payload.dto';
import { TokenResponse } from './dto/token-response.dto';
import { ITokenService } from './interfaces/token-service.interface';
import { TOKEN_CONFIG } from './token.constants';
import { TokenModuleOptions } from './token.module';

interface SecretConfig {
  secret?: string;
  expiresIn: number;
}

@Injectable()
export class TokenService implements ITokenService, OnModuleInit {
  private accessTokenConfig: SecretConfig;
  private refreshTokenConfig: SecretConfig;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(TOKEN_CONFIG) private tokenConfig: TokenModuleOptions,
  ) {}

  onModuleInit() {
    this.accessTokenConfig = {
      secret:
        this.tokenConfig?.accessToken?.secret ??
        this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn:
        this.tokenConfig?.accessToken?.expiresIn ||
        this.configService.get<number>('JWT_ACCESS_EXPIRES_IN') ||
        3600,
    };

    this.refreshTokenConfig = {
      secret:
        this.tokenConfig?.refreshToken?.secret ??
        this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn:
        this.tokenConfig?.refreshToken?.expiresIn ||
        this.configService.get<number>('JWT_REFRESH_EXPIRES_IN') ||
        604800,
    };

    if (!this.accessTokenConfig.secret) {
      throw new Error('JWT_ACCESS_SECRET is not defined');
    }

    if (!this.refreshTokenConfig.secret) {
      throw new Error('JWT_REFRESH_SECRET is not defined');
    }
  }

  async generateAccessToken(payload: TokenPayload): Promise<TokenResponse> {
    return this.generateToken(payload, 'access');
  }

  async generateRefreshToken(payload: TokenPayload): Promise<TokenResponse> {
    return this.generateToken(payload, 'refresh');
  }

  async verifyToken(token: string, isRefresh = false): Promise<TokenPayload> {
    const config = isRefresh ? this.refreshTokenConfig : this.accessTokenConfig;
    return this.jwtService.verifyAsync(token, { secret: config.secret });
  }

  decodeToken(token: string): TokenPayload {
    return this.jwtService.decode(token);
  }

  private async generateToken(
    payload: TokenPayload,
    tokenType: 'access' | 'refresh',
  ): Promise<TokenResponse> {
    const config =
      tokenType === 'access' ? this.accessTokenConfig : this.refreshTokenConfig;

    const expiresIn = config.expiresIn;
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn);

    const token = await this.jwtService.signAsync(payload, {
      secret: config.secret,
      expiresIn,
    });

    return {
      token,
      expiresIn,
      expiresAt,
    };
  }
}
