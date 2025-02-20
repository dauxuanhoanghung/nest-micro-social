// src/modules/password-management/repositories/typeorm-password-history.repository.ts
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordHistory } from '../entities/password-history.entity';
import { IPasswordHistory } from '../interfaces/entity.interface';
import { IPasswordHistoryRepository } from '../interfaces/password-repository.interface';

export class PasswordHistoryRepository implements IPasswordHistoryRepository {
  constructor(
    @InjectRepository(PasswordHistory)
    private readonly repository: Repository<PasswordHistory>,
  ) {}

  private mapToDomain(entity: PasswordHistory): IPasswordHistory {
    return {
      id: entity.id,
      password: entity.password,
      accountId: entity.accountId,
      createdAt: entity.createdAt,
    };
  }

  async save(password: string, accountId: string): Promise<IPasswordHistory> {
    const history = this.repository.create({
      password,
      accountId,
      account: { id: accountId },
    });
    const savedEntity = await this.repository.save(history);
    return this.mapToDomain(savedEntity);
  }

  async findLastPasswords(
    accountId: string,
    limit: number,
  ): Promise<IPasswordHistory[]> {
    const entities = await this.repository.find({
      where: { accountId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
    return entities.map((e) => this.mapToDomain(e));
  }
}
