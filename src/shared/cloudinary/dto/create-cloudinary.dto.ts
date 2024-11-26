import { ArrayNotEmpty, IsString } from 'class-validator';

export class CreateCloudinaryDto {
  @ArrayNotEmpty()
  @IsString({ each: true })
  images: string[];
}
