import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FestivalsService } from './festivals.service';
import { CreateFestivalDto } from './dto/create-festival.dto';
import { UpdateFestivalDto } from './dto/update-festival.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth/jwt-auth.guard';
import { Role } from 'src/shared/utils/enum';
import { Roles } from 'src/shared/decorators/role.decorator';
import { RoleGuard } from 'src/shared/guards/roles/roles.guard';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('festivals')
@UseGuards(JwtAuthGuard, RoleGuard)
export class FestivalsController {
  constructor(private readonly festivalService: FestivalsService) {}

  @Post()
  @Roles(Role.Admin)
  @UseInterceptors(FilesInterceptor('images'))
  create(
    @Body() createFestivalDto: CreateFestivalDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.festivalService.createOneFestival(createFestivalDto, images);
  }

  @Get()
  findAll() {
    return this.festivalService.findAllFestivals();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.festivalService.findOneFestival(id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  @UseInterceptors(FilesInterceptor('images'))
  update(
    @Param('id') id: string,
    @Body() updateFestivalDto: UpdateFestivalDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.festivalService.updateOneFestival(
      id,
      updateFestivalDto,
      images,
    );
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.festivalService.removeOneFestival(id);
  }
}
