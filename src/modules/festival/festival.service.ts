import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateFestivalDto } from './dto/create-festival.dto';
import { UpdateFestivalDto } from './dto/update-festival.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Festival from './entities/festival.entity';

@Injectable()
export class FestivalService {
  constructor(
    @InjectRepository(Festival)
    private readonly festivalRepository: Repository<Festival>,
  ) {}

  async create(createFestivalDto: CreateFestivalDto): Promise<Festival> {
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

  async findAll(): Promise<Festival[]> {
    try {
      return await this.festivalRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve festivals',
        error.message,
      );
    }
  }

  async findOne(id: string): Promise<Festival> {
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
  ): Promise<Festival> {
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
