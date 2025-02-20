import { RegisterAccountDto } from '../dto/auth.dto';

export interface IAuthService {
  register(registerDto: RegisterAccountDto, avatarFile?: Express.Multer.File);
  login();
}
