import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Account } from './entities/account.entity';
import { AccountStatus } from './enums/status';
import { IAccount } from './interfaces/account.interface';
import { IAccountRepository } from './interfaces/repository';

export class AccountRepository implements IAccountRepository {
  constructor(
    @InjectRepository(Account)
    private readonly repository: Repository<Account>,
  ) {}

  async create(
    account: Pick<IAccount, 'email' | 'password' | 'id'>,
  ): Promise<IAccount> {
    const newAccount = this.repository.create({
      ...account,
      status: AccountStatus.NOT_CONFIRMED,
    });

    return await this.repository.save(newAccount);
  }

  async findById(id: string): Promise<IAccount | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<IAccount | null> {
    return await this.repository.findOne({ where: { email } });
  }

  async update(id: string, data: Partial<IAccount>): Promise<IAccount | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async activate(email: string): Promise<IAccount | null> {
    await this.repository.update(email, { status: AccountStatus.ACTIVE });
    return this.findByEmail(email);
  }
}
