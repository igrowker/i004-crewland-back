import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards
} from '@nestjs/common';
import { PublicationValidationUser } from '../../shared/guards/publications/publications-validation-user.guard';
import { PublicationsService } from './publications.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';

@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @Post()
  create(@Body() createPublicationDto: CreatePublicationDto) {
    return this.publicationsService.create(createPublicationDto);
  }

  @Get()
  findAll() {
    return this.publicationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publicationsService.findOne(id);
  }

  @Patch(':id')
  // @UseGuards(PublicationValidationUser)
  update(
    @Param('id') id: string,
    @Body() updatePublicationDto: UpdatePublicationDto,
  ) {
    return this.publicationsService.update(id, updatePublicationDto);
  }

  @Patch(':id/toggle-active')
  // @UseGuards(PublicationValidationUser)
  async toggleActive(@Param('id') id: string) {
    return this.publicationsService.toggleActive(id);
  }

  @Delete(':id')
  // @UseGuards(PublicationValidationUser)
  remove(@Param('id') id: string) {
    return this.publicationsService.remove(id);
  }
}
