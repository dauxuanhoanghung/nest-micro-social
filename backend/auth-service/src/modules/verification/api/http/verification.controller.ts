import { Controller, Get, Query } from '@nestjs/common';
import { VerifyEmailDto } from '../../dto/verify-email.dto';
import { VerificationService } from '../../verification.service';

@Controller('verification')
export class VerificationController {
  constructor(private readonly service: VerificationService) {}

  @Get('verify')
  async verifyEmail(@Query() verifyEmailDto: VerifyEmailDto) {
    await this.service.verify(verifyEmailDto.token);
    return { message: 'Account verified successfully' };
  }
}
