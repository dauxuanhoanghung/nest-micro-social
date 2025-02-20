import { Account } from 'src/modules/account/entities/account.entity';
import { VerificationToken } from '../entities/verification-token.entity';

export const VERIFICATION_REPOSITORY = 'VERIFICATION_REPOSITORY';

export interface IVerificationRepository {
  save(token: VerificationToken): Promise<VerificationToken>;
  findValidToken(
    account: Pick<Account, 'email' | 'id'>,
    token: VerificationToken | string,
  ): Promise<VerificationToken | null>;
  markAsUsed(token: VerificationToken): Promise<void>;
  invalidateTokens(account: Account): Promise<void>;
}
