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
import { VerificationType } from '../enums/token-type.enum';

@Entity({ name: 'verification_token' })
@Index('idx_verification_account_id', ['account'])
@Index('idx_verification_token_type', ['token', 'type'], {
  where: 'disabled = false',
})
export class VerificationToken {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Index()
  @Column({ unique: true })
  token: string; // Token or OTP value

  @Column({
    type: 'varchar',
    length: 20,
    enum: VerificationType,
    default: VerificationType.TOKEN,
  })
  type: VerificationType;

  @ManyToOne(() => Account, (account) => account.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column({ name: 'account_id', type: 'uuid' })
  accountId: string;

  @Column({ default: false })
  disabled: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'used_at' })
  usedAt: Date;

  @Column({ type: 'timestamp', nullable: false, name: 'expires_at' })
  expiresAt: Date;
}
