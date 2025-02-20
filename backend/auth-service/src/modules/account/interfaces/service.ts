export const ACCOUNT_SERVICE = 'ACCOUNT_SERVICE';

export interface IAccountService {
  createAccount(): Promise<void>;
  getAccount(): Promise<void>;
  updateAccount(): Promise<void>;
  deleteAccount(): Promise<void>;
}
