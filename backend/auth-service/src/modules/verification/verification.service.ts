import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { Account } from '../account/entities/account.entity';
import {
  ACCOUNT_SERVICE,
  IAccountService,
} from '../account/interfaces/service';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { VerifyTokenDto } from './dto/verify-token.dto';
import { VerificationToken } from './entities/verification-token.entity';
import { IVerificationRepository } from './interfaces/repositories.interface';
import { IVerificationService } from './interfaces/services.interface';
import { VERIFICATION_REPOSITORY } from './verification.constants';

@Injectable()
export class VerificationService implements IVerificationService {
  private readonly TOKEN_EXPIRATION_HOURS = 24;

  constructor(
    @Inject(VERIFICATION_REPOSITORY)
    private readonly tokenRepository: IVerificationRepository,
    @Inject(ACCOUNT_SERVICE)
    private readonly accountService: IAccountService,
  ) {}

  async generateToken(account: Account): Promise<VerificationToken> {
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + this.TOKEN_EXPIRATION_HOURS);

    const verificationToken = new VerificationToken();
    verificationToken.token = token;
    verificationToken.account = account;
    verificationToken.expiresAt = expiresAt;
    verificationToken.disabled = false;

    return await this.tokenRepository.save(verificationToken);
  }

  async verifyToken(dto: VerifyTokenDto): Promise<VerificationToken> {
    const { email, token } = dto;

    // [OPTIONAL] Check if account exists
    // const account = await this.accountService.findByEmail(email);
    // if (!account) {
    //   throw new BadRequestException('Account not found');
    // }

    const verificationToken = await this.tokenRepository.findValidToken(
      { email },
      token,
    );
    if (!verificationToken) {
      throw new BadRequestException('Invalid or expired token');
    }

    await this.tokenRepository.markAsUsed(verificationToken);
    await this.accountService.activate(email);

    return verificationToken;
  }

  async resendToken(dto: ResendVerificationDto): Promise<VerificationToken> {
    await Promise.resolve();
    throw new Error('Method not implemented');
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<boolean> {
    await Promise.resolve();
    throw new Error('Method not implemented');
  }
}
