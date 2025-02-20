import { Injectable } from '@nestjs/common';
import { CreateLogActionDto } from './dto/create-log-action.dto';
import { UpdateLogActionDto } from './dto/update-log-action.dto';

@Injectable()
export class LogActionService {
  create(createLogActionDto: CreateLogActionDto) {
    return 'This action adds a new logAction';
  }

  findAll() {
    return `This action returns all logAction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} logAction`;
  }

  update(id: number, updateLogActionDto: UpdateLogActionDto) {
    return `This action updates a #${id} logAction`;
  }

  remove(id: number) {
    return `This action removes a #${id} logAction`;
  }
}
