import { IAccount } from './account.interface';

export const ACCOUNT_REPOSITORY = 'ACCOUNT_REPOSITORY';

export interface IAccountRepository {
  create(
    account: Pick<IAccount, 'email' | 'password' | 'id'>,
  ): Promise<IAccount>;
  findById(id: string): Promise<IAccount | null>;
  findByEmail(email: string): Promise<IAccount | null>;
  update(id: string, data: Partial<IAccount>): Promise<IAccount | null>;
  activate(email: string): Promise<IAccount | null>;
}
