import { Injectable } from '@nestjs/common';

import { VerificationType } from '../enums/token-type.enum';
import { IVerificationStrategy } from '../interfaces/verification-strategy.interface';
import { HyperlinkTokenStrategy } from './hyperlink-token.strategy';
import { MailOtpStrategy } from './mail-otp.strategy';
import { SmsOtpStrategy } from './sms-otp.strategy';

@Injectable()
export class VerificationStrategyHolder {
  private readonly strategies: Map<VerificationType, IVerificationStrategy>;

  constructor(
    private readonly hyperlinkTokenStrategy: HyperlinkTokenStrategy,
    private readonly smsOtpStrategy: SmsOtpStrategy,
    private readonly mailOtpStrategy: MailOtpStrategy,
  ) {
    this.strategies = new Map<VerificationType, IVerificationStrategy>([
      [VerificationType.TOKEN, hyperlinkTokenStrategy],
      [VerificationType.SMS_OTP, smsOtpStrategy],
      [VerificationType.EMAIL_OTP, mailOtpStrategy],
    ]);
  }

  getStrategy(type: VerificationType): IVerificationStrategy {
    const strategy = this.strategies.get(type);
    if (!strategy) {
      throw new Error(`No strategy found for verification type: ${type}`);
    }
    return strategy;
  }
}
