import { Injectable } from '@nestjs/common';

import { Account } from 'src/modules/account/entities/account.entity';
import { VerificationToken } from '../entities/verification-token.entity';
import { VerificationType } from '../enums/token-type.enum';
import { BaseOtpStrategy } from './abstract.strategy';

@Injectable()
export class MailOtpStrategy extends BaseOtpStrategy {
  async generate(account: Account): Promise<VerificationToken> {
    const verification = this.createToken(
      account,
      this.generateOtp(),
      VerificationType.EMAIL_OTP,
      15 * 60 * 1000,
    );
    return await this.repository.save(verification);
  }

  async verify(otp: string, account: Pick<Account, 'email'>): Promise<boolean> {
    const verification = await this.repository.findValidToken(
      { email: account.email },
      otp,
      VerificationType.EMAIL_OTP,
    );
    return this.validateAndMarkUsed(verification);
  }

  getType(): VerificationType {
    return VerificationType.EMAIL_OTP;
  }
}
