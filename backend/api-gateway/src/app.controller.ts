/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { HttpService } from '@nestjs/axios';
import { All, Controller, Inject, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    private readonly httpService: HttpService,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    @Inject('POST_SERVICE') private readonly postClient: ClientProxy,
  ) {}

  @All('auth-service/*splat')
  async handleIdentityRequests(@Req() req: Request) {
    // Forward HTTP request to User Service
    const headers = {};
    Object.keys(req.headers).forEach((value, key) => {
      headers[key] = value;
    });

    const response = await firstValueFrom(
      this.httpService.request({
        method: req.method,
        url: `http://localhost:3001${req.url}`,
        data: req.body,
        headers: headers,
      }),
    );

    return response.data;
  }

  @All('user-service/*splat')
  async handleUserRequests(@Req() req: Request) {
    // Forward HTTP request to User Service
    const headers = {};
    Object.keys(req.headers).forEach((value, key) => {
      headers[key] = value;
    });

    const response = await firstValueFrom(
      this.httpService.request({
        method: req.method,
        url: `http://localhost:3002${req.url}`,
        data: req.body,
        headers: headers,
      }),
    );

    return response.data;
  }

  @All('post-service/*splat')
  async handlePostRequests(@Req() req: Request) {
    // Forward HTTP request to Post Service
    // Forward HTTP request to User Service
    const headers = {};
    Object.keys(req.headers).forEach((value, key) => {
      headers[key] = value;
    });

    const response = await firstValueFrom(
      this.httpService.request({
        method: req.method,
        url: `http://localhost:3003${req.url}`,
        data: req.body,
        headers: headers,
      }),
    );

    return response.data;
  }
}
