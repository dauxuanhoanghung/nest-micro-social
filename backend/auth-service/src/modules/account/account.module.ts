import { Module } from '@nestjs/common';

import { AccountRepository } from './account.repository';
import { AccountService } from './account.service';
import { ACCOUNT_REPOSITORY } from './interfaces/repository';
import { ACCOUNT_SERVICE } from './interfaces/service';

@Module({
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
})
export class AccountModule {}
