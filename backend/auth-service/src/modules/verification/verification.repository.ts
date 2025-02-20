import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';

import { Account } from '../account/entities/account.entity';
import { VerificationToken } from './entities/verification-token.entity';
import { IVerificationRepository } from './interfaces/repositories.interface';

@Injectable()
export class VerificationRepository implements IVerificationRepository {
  constructor(
    @InjectRepository(VerificationToken)
    private readonly repository: Repository<VerificationToken>,
  ) {}

  async save(token: VerificationToken): Promise<VerificationToken> {
    return await this.repository.save(token);
  }

  async findValidToken(
    account: Pick<Account, 'email' | 'id'>,
    token: VerificationToken | string,
  ): Promise<VerificationToken | null> {
    token = (typeof token === 'string' ? token : token.token).trim();
    return await this.repository.findOne({
      where: {
        account: { id: account.id },
        token,
        disabled: false,
        expiresAt: MoreThanOrEqual(new Date()),
      },
      relations: ['account'],
    });
  }

  async markAsUsed(token: VerificationToken): Promise<void> {
    token.usedAt = new Date();
    await this.repository.save(token);
  }
  async invalidateOldTokens(account: Account): Promise<void> {
    await this.repository.update(
      { account: { id: account.id }, disabled: false },
      { disabled: true },
    );
  }

  // Implementation for the interface method
  async invalidateTokens(account: Account): Promise<void> {
    return this.invalidateOldTokens(account);
  }
}
