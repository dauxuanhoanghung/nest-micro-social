import { RegisterAccountDto } from '../dto/registration.dto';

export const REGISTRATION_SERVICE = 'REGISTRATION_SERVICE';

export interface IRegistrationService {
  register(registerDto: RegisterAccountDto): Promise<unknown>;
}
