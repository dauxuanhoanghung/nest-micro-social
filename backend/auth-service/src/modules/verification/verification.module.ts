import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountModule } from '../account/account.module';
import { VerificationToken } from './entities/verification-token.entity';
import { AccountCreatedListener } from './listeners/account-created.listener';
import { HyperlinkTokenStrategy } from './strategies/hyperlink-token.strategy';
import { MailOtpStrategy } from './strategies/mail-otp.strategy';
import { SmsOtpStrategy } from './strategies/sms-otp.strategy';
import { VerificationStrategyHolder } from './strategies/verification-strategy-holder';
import { VerificationController } from './transport/http/verification.controller';
import {
  VERIFICATION_REPOSITORY,
  VERIFICATION_SERVICE,
} from './verification.constants';
import { VerificationRepository } from './verification.repository';
import { VerificationService } from './verification.service';

@Module({
  imports: [TypeOrmModule.forFeature([VerificationToken]), AccountModule],
  controllers: [VerificationController],
  providers: [
    {
      provide: VERIFICATION_REPOSITORY,
      useClass: VerificationRepository,
    },
    {
      provide: VERIFICATION_SERVICE,
      useClass: VerificationService,
    },
    AccountCreatedListener,
    SmsOtpStrategy,
    MailOtpStrategy,
    HyperlinkTokenStrategy,
    VerificationStrategyHolder,
  ],
})
export class VerificationModule {}
