import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

import { Account } from '../../account/entities/account.entity';
import { VerificationToken } from '../entities/verification-token.entity';
import { VerificationType } from '../enums/token-type.enum';
import { BaseVerificationStrategy } from './abstract.strategy';

@Injectable()
export class HyperlinkTokenStrategy extends BaseVerificationStrategy {
  async generate(account: Account): Promise<VerificationToken> {
    const token = crypto.randomUUID();
    const verification = this.createToken(
      account,
      token,
      VerificationType.TOKEN,
      24 * 60 * 60 * 1000, // 24 hours
    );
    return await this.repository.save(verification);
  }

  async verify(
    token: string,
    account: Pick<Account, 'email'>,
  ): Promise<boolean> {
    const verification = await this.repository.findValidToken(
      { email: account.email },
      token,
      VerificationType.TOKEN,
    );
    return this.validateAndMarkUsed(verification);
  }

  getType(): VerificationType {
    return VerificationType.TOKEN;
  }
}
