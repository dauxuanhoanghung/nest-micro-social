import { Body, Controller, Inject, Post, UsePipes } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common/pipes';

import { Public } from '../../../auth/decorators/public.decorator';
import { RegisterAccountDto } from '../../dto/registration.dto';
import {
  IRegistrationService,
  REGISTRATION_SERVICE,
} from '../../interfaces/service';

@Controller('registration')
export class RegistrationController {
  constructor(
    @Inject(REGISTRATION_SERVICE)
    private readonly registrationService: IRegistrationService,
  ) {}

  @Public()
  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async register(@Body() registerDto: RegisterAccountDto) {
    return await this.registrationService.register(registerDto);
  }
}
