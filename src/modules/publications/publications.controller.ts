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
import { PublicationValidationUser } from 'src/shared/guards/user-validator/user-validator-publication.guard';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth/jwt-auth.guard';
import { PublicationsService } from './publications.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { FindPublicationsDto } from './dto/find-publications.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @Post(':festivalId') //
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('festivalId') festivalId: string,
    @Body() createPublicationDto: CreatePublicationDto,
    @Request() req,
  ) {
    const userId = req.user.id;

    return this.publicationsService.create(
      festivalId,
      createPublicationDto,
      userId,
    );
  }

  @Get() //
  @UseGuards(JwtAuthGuard)
  async findAll(@Query() filters: FindPublicationsDto) {
    return this.publicationsService.findAll(filters);
  }

  @Get(':id') //
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.publicationsService.findOne(id);
  }

  @Patch(':id') //
  @UseGuards(JwtAuthGuard, PublicationValidationUser)
  update(
    @Param('id') id: string,
    @Body() updatePublicationDto: UpdatePublicationDto,
  ) {
    return this.publicationsService.update(id, updatePublicationDto);
  }

  @Patch(':id/toggle-active')
  @UseGuards(JwtAuthGuard, PublicationValidationUser)
  async toggleActive(@Param('id') id: string) {
    return this.publicationsService.toggleActive(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.publicationsService.remove(id);
  }

  @Patch(':id/add-participant')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async addParticipant(@Param('id') id: string, @Request() req) {
    const userIdFromToken = req.user.id;

    return this.publicationsService.addParticipant(id, userIdFromToken);
  }

  @Patch(':id/remove-participant')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async removeParticipant(@Param('id') id: string, @Request() req) {
    const userIdFromToken = req.user.id;
    return this.publicationsService.removeParticipant(id, userIdFromToken);
  }
}
