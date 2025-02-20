import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AccountStatus } from '../enums/status';

@Entity({ name: 'account' })
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ unique: true, nullable: false })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.NOT_CONFIRMED,
  })
  status: AccountStatus;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
