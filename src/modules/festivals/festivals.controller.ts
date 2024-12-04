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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';

@ApiTags('Festivals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('festivals')
export class FestivalsController {
  constructor(private readonly festivalService: FestivalsService) {}

  @Post()
  @Roles(Role.Admin)
  @UseInterceptors(FilesInterceptor('images'))
  @ApiOperation({ summary: 'Create a new festival' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Festival details including images',
    type: CreateFestivalDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Festival created successfully.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only admins can create festivals.',
  })
  create(
    @Body() createFestivalDto: CreateFestivalDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.festivalService.createOneFestival(createFestivalDto, images);
  }

  @Get()
  @ApiOperation({ summary: 'Get all festivals' })
  @ApiResponse({
    status: 200,
    description: 'List of all festivals.',
  })
  findAll() {
    return this.festivalService.findAllFestivals();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a festival by ID' })
  @ApiResponse({
    status: 200,
    description: 'Festival found.',
  })
  @ApiResponse({
    status: 404,
    description: 'Festival not found.',
  })
  findOne(@Param('id') id: string) {
    return this.festivalService.findOneFestival(id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  @UseInterceptors(FilesInterceptor('images'))
  @ApiOperation({ summary: 'Update a festival by ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Updated festival details including images',
    type: UpdateFestivalDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Festival updated successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Festival not found.',
  })
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
  @ApiOperation({ summary: 'Delete a festival by ID' })
  @ApiResponse({
    status: 200,
    description: 'Festival deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Festival not found.',
  })
  remove(@Param('id') id: string) {
    return this.festivalService.removeOneFestival(id);
  }
}
