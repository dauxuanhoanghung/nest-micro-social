import { AccountStatus } from '../enums/status';

export class CreateUserAccountDto {
  email: string;
  password: string;
  status?: AccountStatus;
}
