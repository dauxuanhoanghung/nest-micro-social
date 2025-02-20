import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { RegisterAccountDto } from './dto/auth.dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('avatar'))
  async register(
    @Body() registerDto: RegisterAccountDto,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    return await this.authService.register(registerDto, avatar);
  }

  @Post('login')
  async login() {
    return this.authService.login();
  }
}
