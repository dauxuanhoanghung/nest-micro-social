import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Account } from '../account/entities/account.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { IRefreshTokenService } from './interfaces/refresh-token-service.interface';

@Injectable()
export class RefreshTokenService implements IRefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly repository: Repository<RefreshToken>,
  ) {}

  async saveRefreshToken(
    token: string,
    account: Account,
    expiresAt: Date,
  ): Promise<RefreshToken> {
    const refreshToken = new RefreshToken();
    refreshToken.token = token;
    refreshToken.account = account;
    refreshToken.expiresAt = expiresAt;
    refreshToken.isRevoked = false;
    return await this.repository.save(refreshToken);
  }

  async revokeRefreshToken(token: string): Promise<void> {
    await this.repository.update({ token }, { isRevoked: true });
  }

  async isRefreshTokenValid(token: string): Promise<boolean> {
    const refreshToken = await this.repository.findOne({
      where: { token, isRevoked: false, expiresAt: MoreThan(new Date()) },
    });
    return !!refreshToken;
  }
}
