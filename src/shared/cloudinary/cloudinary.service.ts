import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import cloudinary from 'src/config/cloudinary.config';
import dotenvOptions from 'src/config/dotenv.config';
import { ImgExtension } from 'src/shared/utils/enum';

@Injectable()
export class CloudinaryService {
  private readonly MAX_SIZE = parseInt(dotenvOptions.MAX_SIZE_IMAGE); // Tamaño máximo en KB
  private readonly DEFAULT_IMG = dotenvOptions.DEFAULT_IMG_EVENT_CLOUDINARY; // Imagen por defecto

  // Verifica si todos los archivos cumplen con el tamaño máximo permitido
  private checkSizeImages(files: Express.Multer.File[]): boolean {
    return files.every((file) => file.size / 1024 <= this.MAX_SIZE); // Correctly checks size in KB
  }

  // Verifica si todos los archivos tienen formatos válidos
  private checkFormatImages(files: Express.Multer.File[]): boolean {
    const validExtensions = Object.values(ImgExtension);
    return files.every((file) => {
      const extension = file.originalname.split('.').pop() as ImgExtension;
      return validExtensions.includes(extension);
    });
  }

  // Verifica la validez de los archivos
  private checkValidImages(files: Express.Multer.File[]): void {
    if (!this.checkSizeImages(files)) {
      throw new HttpException(
        {
          status: 'error',
          message: `Image size cannot exceed ${this.MAX_SIZE}kb`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!this.checkFormatImages(files)) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Image format must be one of: .jpg | .png | .jpeg | .webp',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Sube imágenes a Cloudinary
  async uploadImagesToCloudinary(
    images: Express.Multer.File[],
  ): Promise<string[]> {
    if (images.length === 0) {
      return [this.DEFAULT_IMG]; // Retorna imagen por defecto si no hay imágenes
    }

    try {
      this.checkValidImages(images); // Verifica la validez de las imágenes
      const uploadPromises = images.map((image) => this.uploadFile(image)); // Sube cada imagen
      const results = await Promise.all(uploadPromises); // Espera a que todas las imágenes se suban
      return results.map((result) => result.secure_url); // Retorna las URLs seguras
    } catch (error) {
      console.error('Error uploading files to Cloudinary:', error);
      throw new HttpException(
        {
          status: 'error',
          message: 'Error uploading files to Cloudinary',
          details: error.response?.message || error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Sube un archivo individual a Cloudinary
  private async uploadFile(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: 'auto' }, (error, result) => {
          if (error) {
            console.error('Upload error:', error);
            reject(
              new HttpException(
                {
                  status: 'error',
                  message: 'Failed to upload image to Cloudinary',
                  details: error.message,
                },
                HttpStatus.BAD_REQUEST,
              ),
            );
          } else {
            resolve(result);
          }
        })
        .end(file.buffer);
    });
  }

  // Obtiene todas las imágenes de Cloudinary
  async getAllImagesCloudinary(): Promise<any> {
    try {
      return await cloudinary.api.resources({
        type: 'upload',
        resource_type: 'image',
      });
    } catch (error) {
      console.error('Error fetching images from Cloudinary:', error);
      throw new HttpException(
        {
          status: 'error',
          message: 'Error fetching images from Cloudinary',
          details: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Obtiene una imagen por su ID de Cloudinary
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
        {
          status: 'error',
          message: `Error fetching image with id ${id}`,
          details: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Elimina imágenes de Cloudinary
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
        {
          status: 'error',
          message: 'Error deleting images from Cloudinary',
          details: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
