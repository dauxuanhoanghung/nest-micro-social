import { RegisterAccountDto } from '../dto/auth.dto';

export interface IAuthService {
  register(registerDto: RegisterAccountDto);
  login();
}
