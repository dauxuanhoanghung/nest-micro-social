import { TokenPayload } from '../dto/token-payload.dto';
import { TokenResponse } from '../dto/token-response.dto';

export interface ITokenService {
  generateAccessToken(payload: TokenPayload): Promise<TokenResponse>;
  generateRefreshToken(payload: TokenPayload): Promise<TokenResponse>;
  verifyToken(token: string): Promise<TokenPayload>;
  decodeToken(token: string): TokenPayload;
}
