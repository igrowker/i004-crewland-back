import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publication } from './entities/publication.entity';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { FindPublicationsDto } from './dto/find-publications.dto';
import { FestivalsService } from '../festivals/festivals.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class PublicationsService {
  constructor(
    @InjectRepository(Publication)
    private readonly publicationRepository: Repository<Publication>,
    private readonly festivalService: FestivalsService,
    private readonly usersService: UsersService,

  ) { }

  async create(
    festivalId: string,
    createPublicationDto: CreatePublicationDto,
    userId: string,
  ): Promise<Publication> {
    try {
      const festival = await this.festivalService.findOneFestival(festivalId);

      if (!festival) {
        throw new NotFoundException(`Festival with ID ${festivalId} not found`);
      }

      const user = await this.usersService.getUserById(userId);
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const now = new Date();
      const creationDate = now.toLocaleDateString('es-ES');
      const creationTime = now
        .toLocaleTimeString('es-ES', { hour12: false })
        .slice(0, 5);


      const newPublication = this.publicationRepository.create({
        ...createPublicationDto,
        user,
        festivalId,
        creationDate,
        creationTime,
      });

      return await this.publicationRepository.save(newPublication);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error('Failed to create publication');
    }
  }

  async findAll(filters: FindPublicationsDto): Promise<Publication[]> {
    const queryBuilder =
      this.publicationRepository.createQueryBuilder('publication');

    // Filtrar por tipo
    if (filters.type) {
      queryBuilder.andWhere('publication.type = :type', { type: filters.type });
    }

    // Filtrar por título
    if (filters.title) {
      queryBuilder.andWhere('publication.title LIKE :title', {
        title: `%${filters.title}%`,
      });
    }

    // Filtrar por festivalId
    if (filters.festivalId) {
      queryBuilder.andWhere('publication.festivalId = :festivalId', {
        festivalId: filters.festivalId,
      });
    }

    // Realizar la unión con la tabla de usuarios para traer los datos del usuario
    queryBuilder
      .leftJoinAndSelect('publication.user', 'user')
      .orderBy('publication.creationDate', 'ASC')
      .addOrderBy('publication.creationTime', 'ASC');

    return queryBuilder.getMany();
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
    const publication = await this.publicationRepository.findOne({
      where: { id },
    });

    if (!publication) {
      throw new NotFoundException('Publicación no encontrada');
    }

    publication.isActive = !publication.isActive;

    return await this.publicationRepository.save(publication);
  }

  async addParticipant(
    publicationId: string,
    userId: string,
  ): Promise<Publication> {
    const publication = await this.publicationRepository.findOne({
      where: { id: publicationId },
    });

    if (!publication) {
      throw new NotFoundException('Publicación no encontrada');
    }

    if (!publication.participants) {
      publication.participants = [];
    }

    if (publication.participants.includes(userId)) {
      throw new Error('El usuario ya es participante de esta publicación');
    }
    publication.participants.push(userId);

    return this.publicationRepository.save(publication);
  }

  async removeParticipant(
    publicationId: string,
    userId: string,
  ): Promise<Publication> {
    const publication = await this.publicationRepository.findOne({
      where: { id: publicationId },
    });

    if (!publication) {
      throw new NotFoundException('Publicación no encontrada');
    }

    const index = publication.participants.indexOf(userId);
    if (index === -1) {
      throw new Error('El usuario no es participante de esta publicación');
    }

    publication.participants.splice(index, 1);

    return this.publicationRepository.save(publication);
  }
}
