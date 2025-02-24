import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PrivacyLevel } from '@prisma/client';

export class CreatePrivacyDto {
  @IsEnum(PrivacyLevel)
  @IsNotEmpty()
  level: PrivacyLevel;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
