import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
// import { PublicationValidationUser } from 'src/shared/guards/user-validator/user-validator-publication.guard';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth/jwt-auth.guard';
import { PublicationsService } from './publications.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { FindPublicationsDto } from './dto/find-publications.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Publications')
@ApiBearerAuth()
@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) { }

  @Post(':festivalId') //
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new publication for a festival' })
  @ApiBody({ type: CreatePublicationDto })
  @ApiResponse({
    status: 201,
    description: 'Publication created successfully.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only authenticated users can create publications.',
  })
  async create(
    @Param('festivalId') festivalId: string,
    @Body() createPublicationDto: CreatePublicationDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.publicationsService.create(
      festivalId,
      createPublicationDto,
      userId
    );
  }

  @Get() //
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Retrieve all publications with filters' })
  @ApiResponse({
    status: 200,
    description: 'List of publications retrieved successfully.',
  })
  async findAll(@Query() filters: FindPublicationsDto) {
    return this.publicationsService.findAll(filters);
  }

  @Get(':id') //
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Retrieve a specific publication by ID' })
  @ApiResponse({
    status: 200,
    description: 'Publication retrieved successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Publication not found.',
  })
  findOne(@Param('id') id: string) {
    return this.publicationsService.findOne(id);
  }

  @Patch(':id') //
  // @UseGuards(JwtAuthGuard, PublicationValidationUser)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a publication by ID' })
  @ApiBody({ type: UpdatePublicationDto })
  @ApiResponse({
    status: 200,
    description: 'Publication updated successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Publication not found.',
  })
  update(
    @Param('id') id: string,
    @Body() updatePublicationDto: UpdatePublicationDto,
  ) {
    return this.publicationsService.update(id, updatePublicationDto);
  }

  @Patch(':id/toggle-active')
  // @UseGuards(JwtAuthGuard, PublicationValidationUser)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Toggle the active status of a publication' })
  @ApiResponse({
    status: 200,
    description: 'Publication active status toggled successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Publication not found.',
  })
  async toggleActive(@Param('id') id: string) {
    return this.publicationsService.toggleActive(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a publication by ID' })
  @ApiResponse({
    status: 200,
    description: 'Publication deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Publication not found.',
  })
  remove(@Param('id') id: string) {
    return this.publicationsService.remove(id);
  }

  @Patch(':id/add-participant')
  @UseGuards(JwtAuthGuard)
  async addParticipant(@Param('id') id: string, @Request() req) {
    const userIdFromToken = req.user.id;
    return this.publicationsService.addParticipant(id, userIdFromToken);
  }

  @Patch(':id/remove-participant')
  @UseGuards(JwtAuthGuard)
  async removeParticipant(@Param('id') id: string, @Request() req) {
    const userIdFromToken = req.user.id;
    return this.publicationsService.removeParticipant(id, userIdFromToken);
  }
}
