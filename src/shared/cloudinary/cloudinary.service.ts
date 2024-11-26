import { Injectable } from '@nestjs/common';
import cloudinary from 'src/config/cloudinary.config';
import { File } from 'multer';
// import { File } from '@nestjs/platform-express/multer';
// import { Multer } from '@nestjs/platform-express';

@Injectable()
export class CloudinaryService {
  async uploadFilesToCloudinary(
    files: Array<Express.Multer.File>,
  ): Promise<any[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file));
    return Promise.all(uploadPromises);
  }

  async uploadFile(file: File): Promise<any> {
    const result = await cloudinary.uploader.upload(file.path);
    return result;
  }

  async getAllImagesCloudinary(): Promise<any> {
    const resources = await cloudinary.api.resources({ type: 'upload' });
    return resources;
  }

  async getImgByIdCloudinary(id: string): Promise<any> {
    const resource = await cloudinary.api.resource(id);
    return resource;
  }

  async deleteImgCloudinary(images: string[]): Promise<any> {
    const deletePromises = images.map((image) =>
      cloudinary.uploader.destroy(image),
    );
    return Promise.all(deletePromises);
  }
}
