import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import {
  ACCOUNT_SERVICE,
  IAccountService,
} from '../account/interfaces/service';
import { RegisterAccountDto } from './dto/auth.dto';
import { IAuthService } from './interfaces/service';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(ACCOUNT_SERVICE) private readonly accountService: IAccountService,
  ) {}

  async register(registerDto: RegisterAccountDto) {
    const { email, password, confirmPassword, phoneNumber } = registerDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const account = await this.accountService.create({
      email,
      password,
    });

    return account;
  }

  async login() {
    await Promise.resolve();
    return this.jwtService.sign({ userId: 1 });
  }
}
