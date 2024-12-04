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
  @ApiOperation({ summary: 'Create un nuevo festival' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Detalles del festival incluyendo imagenes',
    type: CreateFestivalDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Festival creado con exito.',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido. Solo los administradores pueden crear festivales.',
  })
  create(
    @Body() createFestivalDto: CreateFestivalDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.festivalService.createOneFestival(createFestivalDto, images);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los festivales' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todos los festivales.',
  })
  findAll() {
    return this.festivalService.findAllFestivals();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un festival por ID' })
  @ApiResponse({
    status: 200,
    description: 'Festival encontrado.',
  })
  @ApiResponse({
    status: 404,
    description: 'Festival no encontrado.',
  })
  findOne(@Param('id') id: string) {
    return this.festivalService.findOneFestival(id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  @UseInterceptors(FilesInterceptor('images'))
  @ApiOperation({ summary: 'Actualizar un festival por ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Detalles actualizados del festival incluyendo imágenes',
    type: UpdateFestivalDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Festival actualizado con éxito.',
  })
  @ApiResponse({
    status: 404,
    description: 'Festival no encontrado.',
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
  @ApiOperation({ summary: 'Eliminar un festival por ID' })
  @ApiResponse({
    status: 200,
    description: 'Festival eliminado con éxito.',
  })
  @ApiResponse({
    status: 404,
    description: 'Festival no encontrado.',
  })
  remove(@Param('id') id: string) {
    return this.festivalService.removeOneFestival(id);
  }
}
