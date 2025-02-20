import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ENCRYPTION_SERVICE } from './encryption.constants';
import { EncryptionService } from './encryption.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: ENCRYPTION_SERVICE,
      useClass: EncryptionService,
    },
  ],
  exports: [
    {
      provide: ENCRYPTION_SERVICE,
      useClass: EncryptionService,
    },
  ],
})
export class EncryptionModule {}
