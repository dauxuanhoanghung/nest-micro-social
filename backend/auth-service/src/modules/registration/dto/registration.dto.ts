import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterAccountDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @IsStrongPassword()
  password: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  confirmPassword: string;

  @ApiProperty()
  @IsString()
  @Matches(/^\d{10}$/, { message: 'Phone number must be 10 digits' })
  phoneNumber: string;
}
