import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { REFRESH_TOKEN_SERVICE } from './interfaces/refresh-token-service.interface';
import { RefreshTokenService } from './refresh-token.service';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken])],
  providers: [
    {
      provide: REFRESH_TOKEN_SERVICE,
      useClass: RefreshTokenService,
    },
  ],
  exports: [REFRESH_TOKEN_SERVICE],
})
export class RefreshTokenModule {}
