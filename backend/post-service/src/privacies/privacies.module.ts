import { Module } from '@nestjs/common';
import { PrivaciesService } from './privacies.service';
import { PrivaciesController } from './privacies.controller';

@Module({
  controllers: [PrivaciesController],
  providers: [PrivaciesService],
})
export class PrivaciesModule {}
