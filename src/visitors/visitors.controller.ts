import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { VisitorsService } from './visitors.service'
import { CreateVisitorDto } from './dto/create-visitor.dto'
import { UpdateVisitorDto } from './dto/update-visitor.dto'

@Controller('visitors')
export class VisitorsController {
  constructor(private readonly visitorsService: VisitorsService) {}

  @Post()
  create(@Body() createVisitorDto: CreateVisitorDto) {
    return this.visitorsService.create(createVisitorDto)
  }

  @Get()
  findAll() {
    return this.visitorsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.visitorsService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVisitorDto: UpdateVisitorDto) {
    return this.visitorsService.update(+id, updateVisitorDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.visitorsService.remove(+id)
  }
}
