import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFestivalDto } from './dto/create-festival.dto';
import { UpdateFestivalDto } from './dto/update-festival.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Festivals } from './entities/festival.entity';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import dotEnvOptions from 'src/config/dotenv.config';

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

  async create(
    createFestivalDto: CreateFestivalDto,
    images: Express.Multer.File[],
  ): Promise<Festivals> {
    try {
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

  async findAll(): Promise<Festivals[]> {
    try {
      return await this.festivalRepository.find();
    } catch (error) {
      this.handleError(error, 'Failed to retrieve festivals');
    }
  }

  async findOne(id: string): Promise<Festivals> {
    try {
      const festival = await this.festivalRepository.findOne({ where: { id } });
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

  async update(
    id: string,
    updateFestivalDto: UpdateFestivalDto,
    images: Express.Multer.File[],
  ): Promise<Festivals> {
    try {
      const festival = await this.findOne(id);
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

      return await this.findOne(id);
    } catch (error) {
      this.handleError(error, `Failed to update festival with ID ${id}`);
    }
  }
  async remove(id: string): Promise<void> {
    try {
      const festival = await this.findOne(id);
      await this.cloudinaryService.deleteImgFromCloudinary(festival.images);
      await this.festivalRepository.delete(id);
    } catch (error) {
      this.handleError(error, `Failed to remove festival with ID ${id}`);
    }
  }
}
