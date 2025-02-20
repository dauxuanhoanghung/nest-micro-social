import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LogActionService } from './log-action.service';
import { CreateLogActionDto } from './dto/create-log-action.dto';
import { UpdateLogActionDto } from './dto/update-log-action.dto';

@Controller('log-action')
export class LogActionController {
  constructor(private readonly logActionService: LogActionService) {}

  @Post()
  create(@Body() createLogActionDto: CreateLogActionDto) {
    return this.logActionService.create(createLogActionDto);
  }

  @Get()
  findAll() {
    return this.logActionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logActionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLogActionDto: UpdateLogActionDto) {
    return this.logActionService.update(+id, updateLogActionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.logActionService.remove(+id);
  }
}
