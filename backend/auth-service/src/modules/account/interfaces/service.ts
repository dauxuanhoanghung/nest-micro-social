import { CreateUserAccountDto } from '../dto/user-account.dto';
import { Account } from '../entities/account.entity';

export const ACCOUNT_SERVICE = 'ACCOUNT_SERVICE';

export interface IAccountService {
  create(account: CreateUserAccountDto): Promise<Account>;
  findByEmail(email: string): Promise<Account | null>;
  activate(email: string): Promise<Account | null>;
}
