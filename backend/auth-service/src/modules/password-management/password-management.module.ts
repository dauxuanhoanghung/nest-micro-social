import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountModule } from '../account/account.module';
import { EncryptionModule } from '../encryption';
import { PasswordHistory } from './entities/password-history.entity';
import { PasswordResetToken } from './entities/password-reset-token-entity';
import { AccountCreatedListener } from './listeners/account-created.listener';
import {
  PASSWORD_HISTORY_REPOSITORY,
  PASSWORD_MANAGEMENT_SERVICE,
  RESET_TOKEN_REPOSITORY,
} from './password-management.constants';
import { PasswordManagementService } from './password-management.service';
import { PasswordHistoryRepository } from './repositories/password-history.repository';
import { PasswordResetTokenRepository } from './repositories/password-reset-token.repository';
import { PasswordManagementController } from './transport/http/password-management.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PasswordHistory, PasswordResetToken]),
    AccountModule,
    EncryptionModule,
  ],
  controllers: [PasswordManagementController],
  providers: [
    {
      provide: PASSWORD_HISTORY_REPOSITORY,
      useClass: PasswordHistoryRepository,
    },
    {
      provide: RESET_TOKEN_REPOSITORY,
      useClass: PasswordResetTokenRepository,
    },
    {
      provide: PASSWORD_MANAGEMENT_SERVICE,
      useClass: PasswordManagementService,
    },
    AccountCreatedListener,
  ],
  exports: [
    RESET_TOKEN_REPOSITORY,
    PASSWORD_HISTORY_REPOSITORY,
    PASSWORD_MANAGEMENT_SERVICE,
  ],
})
export class PasswordManagementModule {}
