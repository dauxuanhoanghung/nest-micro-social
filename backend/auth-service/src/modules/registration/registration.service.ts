import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import {
  ACCOUNT_SERVICE,
  IAccountService,
} from '../account/interfaces/service';
import { RegisterAccountDto } from './dto/registration.dto';
import { IRegistrationService } from './interfaces/service';

@Injectable()
export class RegistrationService implements IRegistrationService {
  constructor(
    @Inject(ACCOUNT_SERVICE) private readonly accountService: IAccountService,
  ) {}

  async register(registerDto: RegisterAccountDto): Promise<unknown> {
    const { email, password, confirmPassword } = registerDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const account = await this.accountService.create({
      email,
      password,
    });

    return account;
  }
}
