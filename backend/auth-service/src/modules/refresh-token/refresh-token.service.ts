import { Injectable } from '@nestjs/common';

@Injectable()
export class RefreshTokenService {
  findAll() {
    return `This action returns all refreshToken`;
  }

  findOne(id: number) {
    return `This action returns a #${id} refreshToken`;
  }

  remove(id: number) {
    return `This action removes a #${id} refreshToken`;
  }
}
