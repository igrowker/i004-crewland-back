import { PartialType } from '@nestjs/mapped-types';
import { CreateCloudinaryDto } from './create-cloudinary.dto';
import { ArrayNotEmpty, IsString } from 'class-validator';

export class DeleteCloudinaryDto extends PartialType(CreateCloudinaryDto) {
  @ArrayNotEmpty()
  @IsString({ each: true })
  images: string[];
}
