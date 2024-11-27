import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import cloudinary from 'src/config/cloudinary.config';
import dotenvOptions from 'src/config/dotenv.config';
import { ImgExtension } from 'src/shared/utils/enum';

@Injectable()
export class CloudinaryService {
  private readonly MAX_SIZE = parseInt(dotenvOptions.MAX_SIZE_IMAGE);
  private readonly DEFAULT_IMG = dotenvOptions.DEFAULT_IMG_EVENT_CLOUDINARY;

  private checkSizeImages(files: Express.Multer.File[]): boolean {
    return files.every((file) => file.size / 1024 <= this.MAX_SIZE);
  }

  private checkFormatImages(files: Express.Multer.File[]): boolean {
    const validExtensions = Object.values(ImgExtension);
    return files.every((file) => {
      const extension = file.originalname.split('.').pop() as ImgExtension;
      if (!validExtensions.includes(extension)) {
        return false;
      }
      return validExtensions.includes(extension);
    });
  }

  private checkValidImages(files: Express.Multer.File[]): true | HttpException {
    if (!this.checkSizeImages(files)) {
      throw new HttpException(
        `Image size cannot exceed ${this.MAX_SIZE}kb`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!this.checkFormatImages(files)) {
      throw new HttpException(
        'Image format must be one of: .jpg | .png | .jpeg | .webp',
        HttpStatus.BAD_REQUEST,
      );
    }
    return true;
  }

  async uploadImagesToCloudinary(
    images: Express.Multer.File[],
  ): Promise<string[]> {
    if (images.length === 0) {
      return [this.DEFAULT_IMG];
    }

    try {
      this.checkValidImages(images);
      const uploadPromises = images.map((image) => this.uploadFile(image));
      const results = await Promise.all(uploadPromises);
      return results.map((result) => result.secure_url);
    } catch (error) {
      console.error('Error uploading files to Cloudinary:', error);
      throw new HttpException(
        'Error uploading files to Cloudinary',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async uploadFile(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: 'auto' }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(file.buffer);
    });
  }

  async getAllImagesCloudinary(): Promise<any> {
    try {
      return await cloudinary.api.resources({
        type: 'upload',
        resource_type: 'image',
      });
    } catch (error) {
      console.error('Error fetching images from Cloudinary:', error);
      throw new HttpException(
        'Error fetching images from Cloudinary',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getImgByIdCloudinary(id: string): Promise<any> {
    try {
      return await cloudinary.api.resource(id, {
        type: 'upload',
        resource_type: 'image',
      });
    } catch (error) {
      console.error(
        `Error fetching image with id ${id} from Cloudinary:`,
        error,
      );
      throw new HttpException(
        `Error fetching image with id ${id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteImgFromCloudinary(images: string[]): Promise<any> {
    try {
      const deletePromises = images.map((image) => {
        if (image !== this.DEFAULT_IMG) {
          const publicId = image.split('/').pop().split('.')[0];
          return cloudinary.uploader.destroy(publicId);
        }
        return Promise.resolve();
      });
      return await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting images from Cloudinary:', error);
      throw new HttpException(
        'Error deleting images from Cloudinary',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
