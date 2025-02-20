import { PartialType } from '@nestjs/swagger';
import { CreateLogActionDto } from './create-log-action.dto';

export class UpdateLogActionDto extends PartialType(CreateLogActionDto) {}
