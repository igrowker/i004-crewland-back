import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publication } from './entities/publication.entity';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';

@Injectable()
export class PublicationsService {
  constructor(
    @InjectRepository(Publication)
    private readonly publicationRepository: Repository<Publication>,
  ) {}

  async create(
    createPublicationDto: CreatePublicationDto,
  ): Promise<Publication> {
    try {
      const newPublication =
        this.publicationRepository.create(createPublicationDto);

      return await this.publicationRepository.save(newPublication);
    } catch (error) {
      throw new Error('Error al crear la publicación: ' + error.message);
    }
  }

  async findAll(): Promise<Publication[]> {
    return await this.publicationRepository.find();
  }

  async findOne(id: string): Promise<Publication> {
    const publication = await this.publicationRepository.findOne({
      where: { id },
    });

    if (!publication) {
      throw new NotFoundException('Publicación no encontrada');
    }

    return publication;
  }

  async update(
    id: string,
    updatePublicationDto: UpdatePublicationDto,
  ): Promise<Publication> {
    const publication = await this.publicationRepository.findOne({
      where: { id },
    });

    if (!publication) {
      throw new NotFoundException('Publicación no encontrada');
    }

    const updatedPublication = Object.assign(publication, updatePublicationDto);
    return await this.publicationRepository.save(updatedPublication);
  }

  async remove(id: string): Promise<void> {
    const publication = await this.publicationRepository.findOne({
      where: { id },
    });

    if (!publication) {
      throw new NotFoundException('Publicación no encontrada');
    }

    await this.publicationRepository.delete(id);
  }

  async toggleActive(id: string): Promise<Publication> {
    const publication = await this.publicationRepository.findOne({ where: { id } });

    if (!publication) {
      throw new NotFoundException('Publicación no encontrada');
    }

    publication.isActive = !publication.isActive;

    return await this.publicationRepository.save(publication);
  }
}
