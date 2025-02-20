import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class RegisterAccountDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @IsStrongPassword()
  password: string;

  @IsString()
  name: string;
}
