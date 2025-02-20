import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AccountCreatedEvent } from '../events/account-created.event';
import { IVerificationService } from '../interfaces/services.interface';
import { VerificationService } from '../verification.service';

@Injectable()
export class AccountCreatedListener {
  constructor(
    @Inject(VerificationService)
    private readonly verificationService: IVerificationService,
  ) {}

  @OnEvent('account.created')
  handleAccountCreatedEvent(event: AccountCreatedEvent) {
    console.log(event);
    this.verificationService.generateToken(event);
  }
}
