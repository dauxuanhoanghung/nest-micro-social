import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { AccountCreatedEvent } from '../../account/events/account-created.event';
import { IVerificationService } from '../interfaces/services.interface';
import { VERIFICATION_SERVICE } from '../verification.constants';

@Injectable()
export class AccountCreatedListener {
  constructor(
    @Inject(VERIFICATION_SERVICE)
    private readonly verificationService: IVerificationService,
  ) {}

  @OnEvent('account.created')
  handleAccountCreatedEvent(event: AccountCreatedEvent) {
    this.verificationService.generateToken(event.account);
  }
}
