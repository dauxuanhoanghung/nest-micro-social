import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PrivaciesService } from './privacies.service';
import { CreatePrivacyDto } from './dto/create-privacy.dto';
import { UpdatePrivacyDto } from './dto/update-privacy.dto';

@Controller('privacies')
export class PrivaciesController {
  constructor(private readonly privaciesService: PrivaciesService) {}

  @Post()
  create(@Body() createPrivacyDto: CreatePrivacyDto) {
    return this.privaciesService.create(createPrivacyDto);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    return this.privaciesService.findAll(Number(page), Number(pageSize));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.privaciesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePrivacyDto: UpdatePrivacyDto) {
    return this.privaciesService.update(+id, updatePrivacyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.privaciesService.remove(+id);
  }
}
