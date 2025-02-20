import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';

@Module({
  controllers: [],
  providers: [RefreshTokenService],
})
export class RefreshTokenModule {}
