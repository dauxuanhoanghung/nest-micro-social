import { Injectable } from '@nestjs/common';

import { Account } from '../../account/entities/account.entity';
import { VerificationToken } from '../entities/verification-token.entity';
import { VerificationType } from '../enums/token-type.enum';
import { BaseOtpStrategy } from './abstract.strategy';

@Injectable()
export class SmsOtpStrategy extends BaseOtpStrategy {
  async generate(account: Account): Promise<VerificationToken> {
    const verification = this.createToken(
      account,
      this.generateOtp(),
      VerificationType.SMS_OTP,
      15 * 60 * 1000, // 15 minutes
    );
    return await this.repository.save(verification);
  }

  async verify(
    otp: string,
    account: Pick<Account, 'phoneNumber'>,
  ): Promise<boolean> {
    const verification = await this.repository.findValidToken(
      { phoneNumber: account.phoneNumber },
      otp,
      VerificationType.SMS_OTP,
    );
    return this.validateAndMarkUsed(verification);
  }

  getType(): VerificationType {
    return VerificationType.SMS_OTP;
  }
}
