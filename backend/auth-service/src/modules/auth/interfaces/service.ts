import { LoginDto, LoginResponseDto } from '../dto/auth.dto';

export const AUTH_SERVICE = 'AUTH_SERVICE';

export interface IAuthService {
  login(loginDto: LoginDto): Promise<LoginResponseDto>;
  logout(): Promise<boolean>;
  logoutAllDevices(): Promise<number>;
}
