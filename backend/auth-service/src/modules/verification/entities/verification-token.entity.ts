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

@Entity({ name: 'verification_token' })
export class VerificationToken {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Index()
  @Column({ unique: true })
  token: string;

  @ManyToOne(() => Account, (account) => account.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column({ default: false })
  disabled: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'used_at' })
  usedAt: Date;

  @Column({ type: 'timestamp', nullable: false, name: 'expires_at' })
  expiresAt: Date;
}
