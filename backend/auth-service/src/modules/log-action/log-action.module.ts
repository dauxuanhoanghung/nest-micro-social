import { Module } from '@nestjs/common';
import { LogActionService } from './log-action.service';
import { LogActionController } from './log-action.controller';

@Module({
  controllers: [LogActionController],
  providers: [LogActionService],
})
export class LogActionModule {}
