import { AccountStatus } from '../enums/status';

export interface IAccount {
  id: string;
  email: string;
  password: string;
  status: AccountStatus;
  createdAt: Date;
  updatedAt: Date;
}
