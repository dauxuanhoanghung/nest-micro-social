import { Account } from 'src/modules/account/entities/account.entity';
import { VerificationToken } from '../entities/verification-token.entity';
import { VerificationType } from '../enums/token-type.enum';

export interface IVerificationRepository {
  save(token: VerificationToken): Promise<VerificationToken>;
  findValidToken(
    account: Partial<Pick<Account, 'email' | 'phoneNumber'>>,
    token: VerificationToken | string,
    type?: VerificationType,
  ): Promise<VerificationToken | null>;
  markAsUsed(token: VerificationToken): Promise<number>;
  invalidateTokens(account: Account): Promise<number>;
}
