import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { BasePasswordDto } from './base-change-password.dto';

export class ChangePasswordDto extends BasePasswordDto {
  @ApiProperty({ description: 'Current password', example: 'OldP@ssw0rd123' })
  @IsString({ message: 'Current password must be a string' })
  currentPassword: string;
}
