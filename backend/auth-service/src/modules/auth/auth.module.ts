import { Module } from '@nestjs/common';

import { AccountModule } from '../account/account.module';
import { EncryptionModule } from '../encryption/encryption.module';
import { RefreshTokenModule } from '../refresh-token/refresh-token.module';
import { TokenModule } from '../token/token.module';
import { AuthService } from './auth.service';
import { AuthController } from './transport/http/auth.controller';

@Module({
  imports: [
    TokenModule.register({}),
    AccountModule,
    EncryptionModule,
    RefreshTokenModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
