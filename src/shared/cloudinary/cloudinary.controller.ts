// import {
//   Controller,
//   Post,
//   Get,
//   Delete,
//   UploadedFiles,
//   UseInterceptors,
//   Body,
//   Param,
// } from '@nestjs/common';
// import { CloudinaryService } from './cloudinary.service';
// import { FilesInterceptor } from '@nestjs/platform-express';
// import { CreateCloudinaryDto } from './dto/create-cloudinary.dto';
// import { UpdateCloudinaryDto } from './dto/update-cloudinary.dto';
// import { DeleteCloudinaryDto } from './dto/delete-cloudinary.dto';
// import { Multer } from 'multer';

// @Controller('cloudinary')
// export class CloudinaryController {
//   constructor(private readonly cloudinaryService: CloudinaryService) {}

//   // Endpoint to upload multiple files
//   @Post('upload')
//   @UseInterceptors(FilesInterceptor('files'))
//   async uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
//     if (!files || files.length === 0) {
//       throw new Error('No files uploaded');
//     }
//     return await this.cloudinaryService.uploadFilesToCloudinary(files);
//   }

//   // Endpoint to retrieve all images
//   @Get()
//   async findAll() {
//     return await this.cloudinaryService.getAllImagesCloudinary();
//   }

//   // Endpoint to retrieve a specific image by ID
//   @Get(':id')
//   async findOne(@Param('id') id: string) {
//     return await this.cloudinaryService.getImgByIdCloudinary(id);
//   }

//   // Endpoint to delete an image
//   @Delete(':id')
//   async remove(@Body() deleteCloudinaryDto: DeleteCloudinaryDto) {
//     return await this.cloudinaryService.deleteImgCloudinary(
//       deleteCloudinaryDto.images,
//     );
//   }
// }

import {
  Controller,
  Post,
  Get,
  Delete,
  UploadedFiles,
  UseInterceptors,
  Body,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DeleteCloudinaryDto } from './dto/delete-cloudinary.dto';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  // Endpoint to upload multiple files
  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }
    return await this.cloudinaryService.uploadFilesToCloudinary(files);
  }

  // Endpoint to retrieve all images
  @Get()
  async findAll() {
    return await this.cloudinaryService.getAllImagesCloudinary();
  }

  // Endpoint to retrieve a specific image by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.cloudinaryService.getImgByIdCloudinary(id);
  }

  // Endpoint to delete images
  @Delete(':id')
  async remove(@Body() deleteCloudinaryDto: DeleteCloudinaryDto) {
    return await this.cloudinaryService.deleteImgCloudinary(
      deleteCloudinaryDto.images,
    );
  }
}
