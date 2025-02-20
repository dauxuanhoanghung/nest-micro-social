import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { IPasswordService } from '../interfaces/password-service.interface';
import { PASSWORD_MANAGEMENT_SERVICE } from '../password-management.constants';

interface AccountCreatedEvent {
  accountId: string;
  password: string;
}

@Injectable()
export class AccountCreatedListener {
  constructor(
    @Inject(PASSWORD_MANAGEMENT_SERVICE)
    private readonly passwordService: IPasswordService,
  ) {}

  @OnEvent('account.created')
  async handleAccountCreatedEvent(event: AccountCreatedEvent) {
    await this.passwordService.resetPassword(event.accountId, event.password);
  }
}
