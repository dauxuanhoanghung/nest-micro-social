import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { RegisterAccountDto } from './dto/auth.dto';
import { IAuthService } from './interfaces/service';

@Injectable()
export class AuthService implements IAuthService {
  constructor(private readonly jwtService: JwtService) {}

  async register(
    registerDto: RegisterAccountDto,
    avatarFile?: Express.Multer.File,
  ) {
    if (avatarFile) {
      throw new Error('Not implemented for uploading avatar files');
    }

    const { email, password, name } = registerDto;
    return { email, password, name };
  }

  async login() {
    return this.jwtService.sign({ userId: 1 });
  }
}
