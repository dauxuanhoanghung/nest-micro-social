import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  ACCOUNT_REPOSITORY,
  IAccountRepository,
} from '../account/interfaces/repository';
import { ENCRYPTION_SERVICE, IEncryptionService } from '../encryption';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import {
  IPasswordHistoryRepository,
  IPasswordResetTokenRepository,
} from './interfaces/password-repository.interface';
import { IPasswordService } from './interfaces/password-service.interface';
import {
  PASSWORD_HISTORY_REPOSITORY,
  RESET_TOKEN_REPOSITORY,
} from './password-management.constants';

@Injectable()
export class PasswordManagementService implements IPasswordService {
  private static HISTORY_PASSWORD_LIST_LENGTH = 3;
  constructor(
    @Inject(PASSWORD_HISTORY_REPOSITORY)
    private readonly historyRepository: IPasswordHistoryRepository,
    @Inject(RESET_TOKEN_REPOSITORY)
    private readonly resetTokenRepository: IPasswordResetTokenRepository,
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepository,
    @Inject(ENCRYPTION_SERVICE) private readonly encryptor: IEncryptionService,
  ) {}

  async updatePassword(accountId: string, newPassword: string): Promise<void> {
    const hashedPassword = await this.encryptor.hash(newPassword);
    await this.accountRepository.update(accountId, {
      password: hashedPassword,
    });
    await this.historyRepository.save(hashedPassword, accountId);
  }

  async changePassword(
    accountId: string,
    dto: ChangePasswordDto,
  ): Promise<void> {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const lastPasswords = await this.historyRepository.findLastPasswords(
      accountId,
      PasswordManagementService.HISTORY_PASSWORD_LIST_LENGTH,
    );
    const comparisons = await Promise.all(
      lastPasswords.map((history) =>
        this.encryptor.compare(dto.newPassword, history.password),
      ),
    );
    const isPasswordUsed = comparisons.some((result) => result === true);

    if (isPasswordUsed) {
      throw new BadRequestException(
        `New password cannot match any of the last ${PasswordManagementService.HISTORY_PASSWORD_LIST_LENGTH} passwords`,
      );
    }

    await this.updatePassword(accountId, dto.newPassword);
  }

  async initiatePasswordReset(email: string): Promise<void> {
    const account = await this.accountRepository.findByEmail(email);
    if (!account) {
      throw new BadRequestException('Account not found');
    }

    const token = Math.random().toString(36).substring(2);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await this.resetTokenRepository.save(account.id, token, expiresAt);

    // [TODO]: Send email with reset link via Notification Service
  }

  async resetPassword(accountId: string, newPassword: string): Promise<void> {
    await this.updatePassword(accountId, newPassword);
  }

  async resetPasswordWithToken(dto: ResetPasswordDto): Promise<void> {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const resetToken = await this.resetTokenRepository.find(dto.token);
    if (!resetToken || resetToken.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    await this.resetPassword(resetToken.accountId, dto.newPassword);
    await this.resetTokenRepository.markAsUsed(dto.token);
  }
}
