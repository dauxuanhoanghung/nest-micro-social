import { Account } from '../../account/entities/account.entity';
import { VerificationToken } from '../entities/verification-token.entity';
import { VerificationType } from '../enums/token-type.enum';

export interface IVerificationStrategy {
  generate(account: Account): Promise<VerificationToken>;
  verify(
    tokenOrOtp: string,
    account: Pick<Account, 'email' | 'phoneNumber'>,
  ): Promise<boolean>;
  getType(): VerificationType;
}

export type VerificationEntity = VerificationToken;
