import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'P@ssw0rd123',
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT access token for authenticated requests',
    example: 'eyJhbGciOiJIUzI1NiIs...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Expiration date and time of the access token',
    example: '2025-03-21T12:00:00.000Z',
  })
  accessExpiresAt: Date;

  @ApiProperty({
    description: 'JWT refresh token to obtain new access tokens',
    example: 'eyJhbGciOiJIUzI1NiIs...',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Expiration date and time of the refresh token',
    example: '2025-04-20T12:00:00.000Z',
  })
  refreshExpiresAt: Date;
}
