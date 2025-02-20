import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordResetToken } from '../entities/password-reset-token-entity';
import { IPasswordResetToken } from '../interfaces/entity.interface';
import { IPasswordResetTokenRepository } from '../interfaces/password-repository.interface';

export class PasswordResetTokenRepository
  implements IPasswordResetTokenRepository
{
  constructor(
    @InjectRepository(PasswordResetToken)
    private readonly repository: Repository<PasswordResetToken>,
  ) {}

  private mapToDomain(entity: PasswordResetToken): IPasswordResetToken {
    return {
      id: entity.id,
      token: entity.token,
      accountId: entity.account.id,
      used: entity.used,
      createdAt: entity.createdAt,
      expiresAt: entity.expiresAt,
    };
  }

  async save(
    accountId: string,
    token: string,
    expiresAt: Date,
  ): Promise<IPasswordResetToken> {
    const resetToken = this.repository.create({
      token,
      account: { id: accountId },
      expiresAt,
    });
    const savedEntity = await this.repository.save(resetToken);
    return this.mapToDomain(savedEntity);
  }

  async find(token: string): Promise<IPasswordResetToken | null> {
    const entity = await this.repository.findOne({
      where: { token, used: false },
      relations: ['account'],
    });
    return entity ? this.mapToDomain(entity) : null;
  }

  async markAsUsed(token: string): Promise<void> {
    await this.repository.update({ token }, { used: true });
  }
}
