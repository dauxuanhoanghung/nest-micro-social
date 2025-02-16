import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('USER_SERVICE') private userClient: ClientProxy,
  ) {}

  @Get('/hi')
  async getHello(): Promise<string> {
    const response = await firstValueFrom(
      this.userClient.send<unknown>('ack-auth-user', 'Hello from Auth Service'),
    );
    this.userClient.emit('emit-auth-user', 'Hello from Auth Service');
    console.log('Response from user service:', response);
    return this.appService.getHello();
  }
}
