import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Account } from '../../entities/account.entity';

@Controller()
export class AccountEventHandler {
  @MessagePattern('retrieve.user.list')
  async findAccounts(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<Account[]> {
    console.log('data', data, 'context', context);
    return await Promise.resolve([]);
  }
}
