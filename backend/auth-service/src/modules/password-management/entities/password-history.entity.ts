import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Account } from '../../account/entities/account.entity';
import { IPasswordHistory } from '../interfaces/entity.interface';

@Entity({ name: 'password_history' })
@Index('IDX_PASSWORD_HISTORY_ACCOUNT_ID', ['accountId'])
export class PasswordHistory implements IPasswordHistory {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column()
  password: string;

  @Column({ name: 'account_id' })
  accountId: string;

  @ManyToOne(() => Account, (account) => account.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
