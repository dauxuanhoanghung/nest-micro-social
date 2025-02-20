import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { IEncryptionService } from './interfaces/service.interface';

@Injectable()
export class EncryptionService implements IEncryptionService {
  private static readonly DEFAULT_SALT_ROUNDS = 10;
  private saltRounds: number;

  constructor(private readonly configService: ConfigService) {
    this.saltRounds =
      this.configService.get<number>('SALT_ROUNDS') ||
      EncryptionService.DEFAULT_SALT_ROUNDS;
  }

  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
