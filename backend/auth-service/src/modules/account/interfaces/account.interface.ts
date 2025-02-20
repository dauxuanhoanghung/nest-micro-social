import { AccountStatus } from '../enums/status';

export interface IAccount {
  id: string;
  email: string;
  password: string;
  phoneNumber?: string;
  status: AccountStatus;
  createdAt: Date;
  updatedAt: Date;
}
