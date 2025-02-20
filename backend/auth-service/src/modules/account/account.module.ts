import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EncryptionModule } from '../encryption/encryption.module';
import { AccountRepository } from './account.repository';
import { AccountService } from './account.service';
import { Account } from './entities/account.entity';
import { ACCOUNT_REPOSITORY } from './interfaces/repository';
import { ACCOUNT_SERVICE } from './interfaces/service';

@Module({
  imports: [TypeOrmModule.forFeature([Account]), EncryptionModule],
  providers: [
    {
      provide: ACCOUNT_SERVICE,
      useClass: AccountService,
    },
    {
      provide: ACCOUNT_REPOSITORY,
      useClass: AccountRepository,
    },
  ],
  exports: [ACCOUNT_SERVICE, ACCOUNT_REPOSITORY],
})
export class AccountModule {}
