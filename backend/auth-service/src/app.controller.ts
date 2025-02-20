import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from './common/types/api-response';

@Controller()
export class AppController {
  @Get()
  getHello(): ApiResponse {
    return {
      status: 200,
      data: 'Hello World from Auth Service',
    };
  }
}
