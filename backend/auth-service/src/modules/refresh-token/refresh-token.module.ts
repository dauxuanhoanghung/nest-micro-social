import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';

@Module({
  imports: [],
  controllers: [],
  providers: [RefreshTokenService],
})
export class RefreshTokenModule {}
