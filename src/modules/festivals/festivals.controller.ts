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
import { FestivalsService } from './festivals.service';
import { CreateFestivalDto } from './dto/create-festival.dto';
import { UpdateFestivalDto } from './dto/update-festival.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth/jwt-auth.guard';
import { Role } from 'src/shared/utils/enum';
import { Roles } from 'src/shared/decorators/role.decorator';
import { RoleGuard } from 'src/shared/guards/roles/roles.guard';

@Controller('festivals')
@UseGuards(JwtAuthGuard, RoleGuard)
export class FestivalsController {
  constructor(private readonly festivalService: FestivalsService) {}

  @Post()
  @Roles(Role.Admin)
  create(@Body() createFestivalDto: CreateFestivalDto) {
    return this.festivalService.create(createFestivalDto);
  }

  @Get()
  findAll() {
    return this.festivalService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.festivalService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  update(
    @Param('id') id: string,
    @Body() updateFestivalDto: UpdateFestivalDto,
  ) {
    return this.festivalService.update(id, updateFestivalDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.festivalService.remove(id);
  }
}
