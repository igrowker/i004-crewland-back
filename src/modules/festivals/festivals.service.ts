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

  private handleError(error: any, message: string): never {
    console.error(error);
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  isValidFutureDate(dateString: string): boolean {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Verifica si la fecha es válida
    if (isNaN(date.getTime())) {
      return false;
    }
    return date > today;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} debe ser una fecha válida y existente en el futuro, no en el pasado`;
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
    // Verifica que la fecha sea valida y exista en el futuro
    if (!this.isValidFutureDate(createFestivalDto.date)) {
      throw new HttpException(
        'La fecha debe ser válida y estar en el futuro',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const { name, date } = createFestivalDto;

      // Verificar si ya existe un festival con el mismo nombre y fecha
      const exists = await this.festivalExists(name, date);
      if (exists) {
        throw new HttpException(
          'Ya existe un festival con este nombre y fecha',
          HttpStatus.CONFLICT,
        );
      }
      // Subir imagenes
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
      this.handleError(error, 'Failed to create festival');
    }
  }

  async findAllFestivals(): Promise<Festivals[]> {
    try {
      return await this.festivalRepository.find();
    } catch (error) {
      this.handleError(error, 'Failed to retrieve festivals');
    }
  }

  async findOneFestival(id: string): Promise<Festivals> {
    try {
      const festival = await this.festivalRepository.findOne({
        where: { id },
      });
      // const festival = await this.festivalRepository.findOneBy({ id });
      if (!festival) {
        throw new HttpException(
          `Festival with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      return festival;
    } catch (error) {
      this.handleError(error, `Failed to retrieve festival with ID ${id}`);
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

      // Manejar nuevos archivos de imagen
      if (images && images.length > 0) {
        await this.cloudinaryService.deleteImgFromCloudinary(festival.images);
        updatedImageUrls =
          await this.cloudinaryService.uploadImagesToCloudinary(images);
      }

      // Manejar URLs de imágenes proporcionadas
      if (
        updateFestivalDto.imageUrls &&
        updateFestivalDto.imageUrls.length > 0
      ) {
        updatedImageUrls = updateFestivalDto.imageUrls;
      }

      // Si no se proporcionaron nuevas imágenes ni URLs, mantener las imágenes existentes
      if (updatedImageUrls.length === 0) {
        updatedImageUrls = festival.images;
      }

      // Actualizar el festival
      await this.festivalRepository.update(
        { id },
        {
          ...updateFestivalDto,
          images: updatedImageUrls,
        },
      );

      return await this.findOneFestival(id);
    } catch (error) {
      this.handleError(error, `Failed to update festival with ID ${id}`);
    }
  }
  async removeOneFestival(id: string): Promise<void> {
    try {
      const festival = await this.findOneFestival(id);
      await this.cloudinaryService.deleteImgFromCloudinary(festival.images);
      await this.festivalRepository.delete(id);
    } catch (error) {
      this.handleError(error, `Failed to remove festival with ID ${id}`);
    }
  }
}
