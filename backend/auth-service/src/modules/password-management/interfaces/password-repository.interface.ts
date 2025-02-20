import { IPasswordHistory, IPasswordResetToken } from './entity.interface';

export interface IPasswordHistoryRepository {
  save(password: string, accountId: string): Promise<IPasswordHistory>;
  findLastPasswords(
    accountId: string,
    limit: number,
  ): Promise<IPasswordHistory[]>;
}

export interface IPasswordResetTokenRepository {
  save(
    accountId: string,
    token: string,
    expiresAt: Date,
  ): Promise<IPasswordResetToken>;
  find(token: string): Promise<IPasswordResetToken | null>;
  markAsUsed(token: string): Promise<void>;
}
