import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from '../../account/entities/account.entity';
import { IPasswordResetToken } from '../interfaces/entity.interface';

@Entity({ name: 'password_reset_token' })
@Index('IDX_ACCOUNT_TOKEN', ['account', 'token'])
export class PasswordResetToken implements IPasswordResetToken {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ unique: true })
  token: string;

  @Column({ name: 'account_id' })
  accountId: string;

  @ManyToOne(() => Account, (account) => account.id, { onDelete: 'CASCADE' })
  account: Account;

  @Column({ default: false })
  used: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamp', name: 'expires_at' })
  expiresAt: Date;
}
