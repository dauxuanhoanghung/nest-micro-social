import { Account } from '../../account/entities/account.entity';

export interface IVerificationService {
  verify(token: string): Promise<void>;
  generateToken(account: Partial<Account>): Promise<string>;
}
