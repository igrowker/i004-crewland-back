import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FestivalService } from './festival.service';
import { CreateFestivalDto } from './dto/create-festival.dto';
import { UpdateFestivalDto } from './dto/update-festival.dto';
// import { ObjectId } from 'typeorm';
// import { LoggerGuard } from 'src/guards/logger.guard';

@Controller('festival')
export class FestivalController {
  constructor(private readonly festivalService: FestivalService) {}

  @UseGuards()
  @Post()
  create(@Body() createFestivalDto: CreateFestivalDto) {
    return this.festivalService.create(createFestivalDto);
  }

  @UseGuards()
  @Get()
  findAll() {
    return this.festivalService.findAll();
  }

  @UseGuards()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.festivalService.findOne(id);
  }

  @UseGuards()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFestivalDto: UpdateFestivalDto,
  ) {
    return this.festivalService.update(id, updateFestivalDto);
  }

  @UseGuards()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.festivalService.remove(id);
  }
}
