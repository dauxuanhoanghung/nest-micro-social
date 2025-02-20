import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto } from '../../dto/change-password.dto';
import { ResetPasswordDto } from '../../dto/reset-password.dto';
import { IPasswordService } from '../../interfaces/password-service.interface';
import { PASSWORD_MANAGEMENT_SERVICE } from '../../password-management.constants';

@ApiTags('Password Management')
@Controller('password')
export class PasswordManagementController {
  constructor(
    @Inject(PASSWORD_MANAGEMENT_SERVICE)
    private readonly passwordService: IPasswordService,
  ) {}

  @Post('change')
  // @UseGuards(AuthGuard('jwt')) // Assuming JWT authentication
  @ApiOperation({ summary: 'Change user password' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request (validation errors)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async changePassword(@Body() dto: ChangePasswordDto) {
    // [TODO]: GET password from access token
    const accountId = '';
    await this.passwordService.changePassword(accountId, dto);
    return { message: 'Password changed successfully' };
  }

  @Post('forgot')
  @ApiOperation({ summary: 'Initiate password reset' })
  @ApiBody({
    schema: { type: 'object', properties: { email: { type: 'string' } } },
  })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  @ApiResponse({ status: 400, description: 'Bad request (invalid email)' })
  async forgotPassword(@Body('email') email: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    await this.passwordService.initiatePasswordReset(email);
    return { message: 'Password reset email sent' };
  }

  @Post('reset')
  @ApiOperation({ summary: 'Reset password using token' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad request (invalid token or password mismatch)',
  })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    const accountId = ''; // [TODO]: Get account ID from token
    await this.passwordService.resetPassword(accountId, dto.newPassword);
    return { message: 'Password reset successfully' };
  }
}
