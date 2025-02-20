import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';

import { Account } from '../account/entities/account.entity';
import { VerificationToken } from './entities/verification-token.entity';
import { VerificationType } from './enums/token-type.enum';
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
    account: Partial<Pick<Account, 'email' | 'phoneNumber'>>,
    token: VerificationToken | string,
    type?: VerificationType,
  ): Promise<VerificationToken | null> {
    const tokenValue = (typeof token === 'string' ? token : token.token).trim();
    return await this.repository.findOne({
      where: {
        account: { email: account.email },
        token: tokenValue,
        type: type || VerificationType.TOKEN,
        disabled: false,
        expiresAt: MoreThanOrEqual(new Date()),
      },
      relations: ['account'],
    });
  }

  async markAsUsed(token: VerificationToken): Promise<number> {
    const result = await this.repository.update(
      { id: token.id },
      { usedAt: new Date(), disabled: true },
    );

    return result.affected || 0;
  }

  async invalidateOldTokens(account: Account): Promise<number> {
    const result = await this.repository.update(
      { account: { id: account.id }, disabled: false },
      { disabled: true },
    );

    return result.affected || 0;
  }

  // Implementation for the interface method
  async invalidateTokens(account: Account): Promise<number> {
    return this.invalidateOldTokens(account);
  }
}
