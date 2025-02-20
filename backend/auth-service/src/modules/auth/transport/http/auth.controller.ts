import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../../auth.service';
import { Public } from '../../decorators/public.decorator';
import { LoginDto, LoginResponseDto } from '../../dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate a user and return a JWT token',
  })
  @ApiBody({ type: LoginDto, description: 'User login credentials' })
  @ApiResponse({
    status: 200,
    description:
      'Login successful, returns access and refresh tokens with expiration dates',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request (missing or invalid email/password)',
  })
  async login(@Body() body: LoginDto): Promise<LoginResponseDto> {
    return await this.authService.login(body);
  }

  @Post('logout')
  @ApiOperation({
    summary: 'User logout',
    description: 'Log out the current user session',
  })
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Logout successful' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized (invalid or missing token)',
  })
  async logout() {
    return await this.authService.logout();
  }

  @Post('logout-all-devices')
  @ApiOperation({
    summary: 'Logout from all devices',
    description: 'Invalidate all active sessions for the user',
  })
  @ApiResponse({
    status: 200,
    description: 'All sessions logged out successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Logged out from all devices' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized (invalid or missing token)',
  })
  async logoutAllDevices() {
    return await this.authService.logoutAllDevices();
  }
}
