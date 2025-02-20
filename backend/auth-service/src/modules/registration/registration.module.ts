import { Module } from '@nestjs/common';
import { AccountModule } from '../account/account.module';
import { REGISTRATION_SERVICE } from './interfaces/service';
import { RegistrationService } from './registration.service';
import { RegistrationController } from './transport/http/registration.controller';

@Module({
  imports: [AccountModule],
  controllers: [RegistrationController],
  providers: [
    {
      provide: REGISTRATION_SERVICE,
      useClass: RegistrationService,
    },
  ],
  exports: [],
})
export class RegistrationModule {}
