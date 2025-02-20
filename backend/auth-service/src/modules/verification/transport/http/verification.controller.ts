import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
} from '@nestjs/common';

import { ResendVerificationDto } from '../../dto/resend-verification.dto';
import { VerifyOtpDto } from '../../dto/verify-otp.dto';
import { VerifyTokenDto } from '../../dto/verify-token.dto';
import { IVerificationService } from '../../interfaces/services.interface';
import { VERIFICATION_SERVICE } from '../../verification.constants';

@Controller('verification')
export class VerificationController {
  constructor(
    @Inject(VERIFICATION_SERVICE)
    private readonly service: IVerificationService,
  ) {}

  @Post('verify/token')
  async verifyToken(@Body() dto: VerifyTokenDto) {
    const success = await this.service.verifyToken(dto);
    if (!success) {
      throw new BadRequestException('Invalid or expired token');
    }
    return { message: 'Token verified successfully' };
  }

  @Post('verify/otp')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    const success = await this.service.verifyOtp(dto);
    if (!success) {
      throw new BadRequestException('Invalid or expired OTP');
    }
    return { message: 'OTP verified successfully' };
  }

  @Post('resend')
  async resend(@Body() dto: ResendVerificationDto) {
    await Promise.resolve();
    throw new Error('Method not implemented');
  }
}
