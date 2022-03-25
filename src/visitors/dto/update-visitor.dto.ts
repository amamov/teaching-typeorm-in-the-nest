import { PartialType } from '@nestjs/swagger';
import { CreateVisitorDto } from './create-visitor.dto';

export class UpdateVisitorDto extends PartialType(CreateVisitorDto) {}
