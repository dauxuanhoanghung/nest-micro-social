import { Controller, Get, Param } from '@nestjs/common';

@Controller('/users')
export class UserController {
  @Get(':id')
  findOne(@Param('id') id: string): string {
    console.log(id);
    return `This action returns a #${id} cat`;
  }
}
