import { Controller, Get } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('ack-auth-user')
  handleAuthMessage(@Payload() data: any) {
    console.log('Received message in user service:', data);
    return this.appService.getHello();
  }

  @EventPattern('emit-auth-user')
  emitHello(data: string) {
    console.log('Received data:', data);
  }
}
