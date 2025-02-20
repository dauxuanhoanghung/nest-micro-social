import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { VerificationType } from '../enums/token-type.enum';

export class ResendVerificationDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsEnum(VerificationType)
  method: VerificationType;
}
