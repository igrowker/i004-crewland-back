import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFestivalDto } from './dto/create-festival.dto';
import { UpdateFestivalDto } from './dto/update-festival.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Festivals } from './entities/festival.entity';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import dotEnvOptions from 'src/config/dotenv.config';
import { ValidationArguments } from 'class-validator';

@Injectable()
export class FestivalsService {
  constructor(
    @InjectRepository(Festivals)
    private readonly festivalRepository: Repository<Festivals>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  isValidFutureDate(dateString: string): boolean {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(date.getTime())) {
      return false;
    }
    return date > today;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} Debe ser una fecha válida y existente en el futuro, no en el pasado`;
  }

  async festivalExists(name: string, date: string): Promise<boolean> {
    const existingFestival = await this.festivalRepository.findOne({
      where: { name, date: new Date(date) },
    });
    return !!existingFestival;
  }

  async createOneFestival(
    createFestivalDto: CreateFestivalDto,
    images: Express.Multer.File[],
  ): Promise<Festivals> {
    try {
      if (!this.isValidFutureDate(createFestivalDto.date)) {
        throw new HttpException(
          'La fecha debe ser válida y estar en el futuro',
          HttpStatus.BAD_REQUEST,
        );
      }

      const { name, date } = createFestivalDto;

      const exists = await this.festivalExists(name, date);
      if (exists) {
        throw new HttpException(
          'Ya existe un festival con este nombre y fecha',
          HttpStatus.CONFLICT,
        );
      }

      let imageUrls: string[];
      if (images && images.length > 0) {
        imageUrls =
          await this.cloudinaryService.uploadImagesToCloudinary(images);
      } else {
        imageUrls = [dotEnvOptions.DEFAULT_IMG_EVENT_CLOUDINARY];
      }

      const newFestival = this.festivalRepository.create({
        ...createFestivalDto,
        images: imageUrls,
      });
      return await this.festivalRepository.save(newFestival);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'No se pudo crear el festival',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllFestivals(): Promise<Festivals[]> {
    try {
      return await this.festivalRepository.find();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'No se pudieron recuperar los festivales',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneFestival(id: string): Promise<Festivals> {
    try {
      const festival = await this.festivalRepository.findOne({
        where: { id },
      });
      if (!festival) {
        throw new HttpException(
          `Festival con ID ${id} no encontrado`,
          HttpStatus.NOT_FOUND,
        );
      }
      return festival;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `No se pudo recuperar el festival con ID ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateOneFestival(
    id: string,
    updateFestivalDto: UpdateFestivalDto,
    images: Express.Multer.File[],
  ): Promise<Festivals> {
    try {
      const festival = await this.findOneFestival(id);

      if (updateFestivalDto.name || updateFestivalDto.date) {
        const exists = await this.festivalRepository.findOne({
          where: {
            name: updateFestivalDto.name || festival.name,
            date: updateFestivalDto.date
              ? new Date(updateFestivalDto.date)
              : festival.date,
            id: Not(id),
          },
        });
        if (exists) {
          throw new HttpException(
            'Ya existe otro festival con este nombre y fecha',
            HttpStatus.CONFLICT,
          );
        }
      }

      let updatedImageUrls: string[] = [];

      if (images && images.length > 0) {
        await this.cloudinaryService.deleteImgFromCloudinary(festival.images);
        updatedImageUrls =
          await this.cloudinaryService.uploadImagesToCloudinary(images);
      }

      if (
        updateFestivalDto.imageUrls &&
        updateFestivalDto.imageUrls.length > 0
      ) {
        updatedImageUrls = updateFestivalDto.imageUrls;
      }

      if (updatedImageUrls.length === 0) {
        updatedImageUrls = festival.images;
      }

      await this.festivalRepository.update(
        { id },
        {
          ...updateFestivalDto,
          images: updatedImageUrls,
        },
      );

      return await this.findOneFestival(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `No se pudo actualizar el festival con ID ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeOneFestival(id: string): Promise<void> {
    try {
      const festival = await this.findOneFestival(id);
      await this.cloudinaryService.deleteImgFromCloudinary(festival.images);
      await this.festivalRepository.delete(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `No se pudo eliminar el festival con ID ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
