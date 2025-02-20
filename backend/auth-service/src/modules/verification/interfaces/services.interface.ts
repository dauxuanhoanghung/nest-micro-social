import { Account } from 'src/modules/account/entities/account.entity';
import { ResendVerificationDto } from '../dto/resend-verification.dto';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { VerifyTokenDto } from '../dto/verify-token.dto';
import { VerificationToken } from '../entities/verification-token.entity';

export interface IVerificationService {
  generateToken(account: Account): Promise<VerificationToken>;
  resendToken(dto: ResendVerificationDto): Promise<VerificationToken>;
  verifyToken(dto: VerifyTokenDto): Promise<VerificationToken>;
  verifyOtp(dto: VerifyOtpDto): Promise<boolean>;
}
