import { Account } from '../../account/entities/account.entity';
import { RefreshToken } from '../entities/refresh-token.entity';

export const REFRESH_TOKEN_SERVICE = 'REFRESH_TOKEN_SERVICE';

export interface IRefreshTokenService {
  saveRefreshToken(
    token: string,
    account: Account,
    expiresAt?: Date,
  ): Promise<RefreshToken>;
  revokeRefreshToken(token: string): Promise<void>;
  isRefreshTokenValid(token: string): Promise<boolean>;
}
