import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { Account } from '../account/entities/account.entity';
import { AccountStatus } from '../account/enums/status';
import {
  ACCOUNT_SERVICE,
  IAccountService,
} from '../account/interfaces/service';
import {
  IVerificationRepository,
  VERIFICATION_REPOSITORY,
} from './interfaces/repositories.interface';
import { IVerificationService } from './interfaces/services.interface';

@Injectable()
export class VerificationService implements IVerificationService {
  private readonly TOKEN_EXPIRATION_HOURS = 24;

  constructor(
    @Inject(VERIFICATION_REPOSITORY)
    private readonly tokenRepository: IVerificationRepository,
    @Inject(ACCOUNT_SERVICE)
    private readonly accountService: IAccountService,
  ) {}

  async generateToken(account: Partial<Account>): Promise<string> {
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + this.TOKEN_EXPIRATION_HOURS);

    const verificationToken = this.tokenRepository.create({
      token,
      account,
      expiresAt,
    });

    await this.tokenRepository.save(verificationToken);
    return token;
  }

  async verify(token: string): Promise<void> {
    const verificationToken = await this.tokenRepository.findOne({
      where: { token },
      relations: ['account'],
    });

    if (!verificationToken) {
      throw new NotFoundException('Invalid or expired verification token');
    }

    if (new Date() > verificationToken.expiresAt) {
      await this.tokenRepository.remove(verificationToken);
      throw new BadRequestException('Verification token has expired');
    }

    verificationToken.account.status = AccountStatus.ACTIVE;
    await this.accountService.activate(verificationToken.account.email);
    await this.tokenRepository.remove(verificationToken);
  }
}
