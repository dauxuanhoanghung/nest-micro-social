import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsStrongPassword, MinLength } from 'class-validator';

export abstract class BasePasswordDto {
  @ApiProperty({ description: 'New password', example: 'P@ssw0rd123' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol',
    },
  )
  newPassword: string;

  @ApiProperty({ description: 'Password confirmation', example: 'P@ssw0rd123' })
  @IsString({ message: 'Confirm password must be a string' })
  @MinLength(8, {
    message: 'Confirm password must be at least 8 characters long',
  })
  confirmPassword: string;
}
