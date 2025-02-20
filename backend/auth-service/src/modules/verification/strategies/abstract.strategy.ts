import { Inject, Injectable } from '@nestjs/common';
import { Account } from '../../account/entities/account.entity';
import { VerificationToken } from '../entities/verification-token.entity';
import { VerificationType } from '../enums/token-type.enum';
import { IVerificationRepository } from '../interfaces/repositories.interface';
import { IVerificationStrategy } from '../interfaces/verification-strategy.interface';
import { VERIFICATION_REPOSITORY } from '../verification.constants';

@Injectable()
export abstract class BaseVerificationStrategy
  implements IVerificationStrategy
{
  constructor(
    @Inject(VERIFICATION_REPOSITORY)
    protected readonly repository: IVerificationRepository,
  ) {}

  abstract generate(account: Account): Promise<VerificationToken>;
  abstract verify(
    tokenOrOtp: string,
    account: Pick<Account, 'email' | 'phoneNumber'>,
  ): Promise<boolean>;
  abstract getType(): VerificationType;

  protected createToken(
    account: Account,
    token: string,
    type: VerificationType,
    expiresInMs: number,
  ): VerificationToken {
    const verification = new VerificationToken();
    verification.accountId = account.id;
    verification.token = token;
    verification.type = type;
    verification.disabled = false;
    verification.expiresAt = new Date(Date.now() + expiresInMs);
    return verification;
  }

  protected async validateAndMarkUsed(
    verification: VerificationToken | null,
  ): Promise<boolean> {
    if (!verification) {
      return false;
    }
    await this.repository.markAsUsed(verification);
    return true;
  }
}

@Injectable()
export abstract class BaseOtpStrategy extends BaseVerificationStrategy {
  protected generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  }
}
