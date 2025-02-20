import { ChangePasswordDto } from '../dto/change-password.dto';

export interface IResetPasswordService {
  resetPassword(accountId: string, newPassword: string): Promise<void>;
  initiatePasswordReset(email: string): Promise<void>;
}

export interface IPasswordService extends IResetPasswordService {
  changePassword(accountId: string, dto: ChangePasswordDto): Promise<void>;
  updatePassword(accountId: string, newPassword: string): Promise<void>; // Added core method
}
