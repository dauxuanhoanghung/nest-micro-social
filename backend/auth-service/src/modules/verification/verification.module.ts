import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from '../account/account.module';
import { VerificationController } from './api/http/verification.controller';
import { VerificationToken } from './entities/verification-token.entity';
import { VERIFICATION_REPOSITORY } from './interfaces/repositories.interface';
import { AccountCreatedListener } from './listeners/account-created.listener';
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
    VerificationService,
    AccountCreatedListener,
  ],
})
export class VerificationModule {}
