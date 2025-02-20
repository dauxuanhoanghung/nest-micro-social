import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { BasePasswordDto } from './base-change-password.dto';

export class ResetPasswordDto extends BasePasswordDto {
  @ApiProperty({ description: 'Reset token', example: 'abc123xyz' })
  @IsString({ message: 'Token must be a string' })
  token: string;
}
