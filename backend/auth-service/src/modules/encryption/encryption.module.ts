import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EncryptionService } from './encryption.service';
import { ENCRYPTION_SERVICE } from './interfaces/service.interface';

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
