import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateFestivalDto } from './dto/create-festival.dto';
import { UpdateFestivalDto } from './dto/update-festival.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Festivals } from './entities/festival.entity';

@Injectable()
export class FestivalsService {
  constructor(
    @InjectRepository(Festivals)
    private readonly festivalRepository: Repository<Festivals>,
  ) {}

  // async updateImages(id: string, imageUrls: string[]): Promise<Festivals> {
  //   const festival = await this.festivalRepository.findOne({ where: { id } });
  //   if (!festival) {
  //     throw new NotFoundException(`Festival with ID ${id} not found`);
  //   }

  //   // Actualiza el campo images con las nuevas URLs
  //   festival.image = imageUrls;

  //   return this.festivalRepository.save(festival);
  // }

  async create(createFestivalDto: CreateFestivalDto): Promise<Festivals> {
    try {
      const newFestival = this.festivalRepository.create(createFestivalDto);
      return await this.festivalRepository.save(newFestival);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create festival',
        error.message,
      );
    }
  }

  async findAll(): Promise<Festivals[]> {
    try {
      return await this.festivalRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve festivals',
        error.message,
      );
    }
  }

  async findOne(id: string): Promise<Festivals> {
    try {
      const festival = await this.festivalRepository.findOne({
        where: { id },
      });
      if (!festival) {
        throw new NotFoundException(`Festival with ID ${id} not found`);
      }
      return festival;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to retrieve festival',
        error.message,
      );
    }
  }

  async update(
    id: string,
    updateFestivalDto: UpdateFestivalDto,
  ): Promise<Festivals> {
    try {
      const result = await this.festivalRepository.update(
        { id },
        updateFestivalDto,
      );
      if (result.affected === 0) {
        throw new NotFoundException(`Festival with ID ${id} not found`);
      }
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to update festival',
        error.message,
      );
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.festivalRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Festival with ID ${id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to remove festival',
        error.message,
      );
    }
  }
}
