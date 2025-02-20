export interface IPasswordHistory {
  id: string;
  password: string;
  accountId: string;
  createdAt: Date;
}

export interface IPasswordResetToken {
  id: string;
  token: string;
  accountId: string;
  used: boolean;
  createdAt: Date;
  expiresAt: Date;
}
