import { IAccountRepository } from './interfaces/repository';

export class AccountRepository implements IAccountRepository {
  async createAccount(): Promise<void> {
    console.log('Creating account...');
  }
}
