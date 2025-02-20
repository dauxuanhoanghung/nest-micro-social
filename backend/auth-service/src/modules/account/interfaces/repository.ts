export const ACCOUNT_REPOSITORY = 'ACCOUNT_REPOSITORY';

export interface IAccountRepository {
  createAccount(): Promise<void>;
}
