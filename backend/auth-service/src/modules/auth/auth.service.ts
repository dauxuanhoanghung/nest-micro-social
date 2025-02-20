import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { AccountStatus } from '../account/enums/status';
import {
  ACCOUNT_SERVICE,
  IAccountService,
} from '../account/interfaces/service';
import { ENCRYPTION_SERVICE, IEncryptionService } from '../encryption';
import {
  IRefreshTokenService,
  REFRESH_TOKEN_SERVICE,
} from '../refresh-token/interfaces/refresh-token-service.interface';
import { ITokenService, TOKEN_SERVICE } from '../token';
import { LoginDto, LoginResponseDto } from './dto/auth.dto';
import { IAuthService } from './interfaces/service';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(ENCRYPTION_SERVICE) private readonly encryptor: IEncryptionService,
    @Inject(ACCOUNT_SERVICE) private readonly accountService: IAccountService,
    @Inject(TOKEN_SERVICE) private readonly tokenProvider: ITokenService,
    @Inject(REFRESH_TOKEN_SERVICE)
    private readonly refreshTokenService: IRefreshTokenService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;
    const account = await this.accountService.findByEmail(email);

    if (!account) {
      throw new BadRequestException('Invalid credentials');
    }

    if (account.status !== AccountStatus.ACTIVE) {
      throw new BadRequestException('Account is not activated');
    }

    if (await this.encryptor.compare(password, account.password)) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { sub: account.id, email: account.email };
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenProvider.generateAccessToken(payload),
      this.tokenProvider.generateRefreshToken(payload),
    ]);

    await this.refreshTokenService.saveRefreshToken(
      refreshToken.token,
      account,
      refreshToken.expiresAt,
    );

    return {
      accessToken: accessToken.token,
      accessExpiresAt: accessToken.expiresAt,
      refreshToken: refreshToken.token,
      refreshExpiresAt: refreshToken.expiresAt,
    };
  }

  async logout(): Promise<boolean> {
    await Promise.resolve();
    throw new Error('Method not implemented.');
  }

  async logoutAllDevices(): Promise<number> {
    await Promise.resolve();
    throw new Error('Method not implemented.');
  }
}
