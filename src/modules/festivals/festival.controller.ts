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

// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   UseGuards,
//   UsePipes,
//   ValidationPipe,
// } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
// import { RolesGuard } from '../guards/roles.guard';
// import { Roles } from '../decorators/roles.decorator';
// import { ThrottlerGuard } from '@nestjs/throttler';
// import { FestivalService } from './festival.service';
// import { CreateFestivalDto } from './dto/create-festival.dto';
// import { UpdateFestivalDto } from './dto/update-festival.dto';

// @Controller('festival')
// @UseGuards(AuthGuard('jwt'), RolesGuard, ThrottlerGuard)
// @UsePipes(new ValidationPipe())
// export class FestivalController {
//   constructor(private readonly festivalService: FestivalService) {}

//   @Post()
//   @Roles('admin')
//   create(@Body() createFestivalDto: CreateFestivalDto) {
//     return this.festivalService.create(createFestivalDto);
//   }

//   @Get()
//   findAll() {
//     return this.festivalService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.festivalService.findOne(id);
//   }

//   @Patch(':id')
//   @Roles('admin')
//   update(
//     @Param('id') id: string,
//     @Body() updateFestivalDto: UpdateFestivalDto,
//   ) {
//     return this.festivalService.update(id, updateFestivalDto);
//   }

//   @Delete(':id')
//   @Roles('admin')
//   remove(@Param('id') id: string) {
//     return this.festivalService.remove(id);
//   }
// }
