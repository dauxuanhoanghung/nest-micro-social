import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { v4 as uuidv4 } from 'uuid';

import { ENCRYPTION_SERVICE, IEncryptionService } from '../encryption';
import { CreateUserAccountDto } from './dto/user-account.dto';
import { Account } from './entities/account.entity';
import { AccountCreatedEvent } from './events/account-created.event';
import {
  ACCOUNT_REPOSITORY,
  IAccountRepository,
} from './interfaces/repository';
import { IAccountService } from './interfaces/service';

@Injectable()
export class AccountService implements IAccountService {
  constructor(
    @Inject(ACCOUNT_REPOSITORY) private readonly repository: IAccountRepository,
    @Inject(ENCRYPTION_SERVICE) private readonly encryptor: IEncryptionService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(accountReq: CreateUserAccountDto): Promise<Account> {
    const { email, password } = accountReq;
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    if (!password) {
      throw new BadRequestException(
        'Password is required and must be at least 8 characters',
      );
    }

    const existingAccount = await this.repository.findByEmail(email);
    if (existingAccount) {
      throw new ConflictException('Email is already registered');
    }

    const newAccount = await this.repository.create({
      id: uuidv4(),
      email: email,
      password: await this.encryptor.hash(password),
    });

    this.eventEmitter.emit('account.created', {
      account: newAccount,
    } as AccountCreatedEvent);

    return newAccount;
  }

  async findByEmail(email: string): Promise<Account | null> {
    return await this.repository.findByEmail(email);
  }

  async activate(email: string): Promise<Account | null> {
    return await this.repository.activate(email);
  }
}
