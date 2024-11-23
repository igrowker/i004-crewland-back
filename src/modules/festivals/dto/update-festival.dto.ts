import { PartialType } from '@nestjs/mapped-types';
import { CreateFestivalDto } from './create-festival.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class UpdateFestivalDto extends PartialType(CreateFestivalDto) {
  @ApiProperty({
    description: 'El nombre del festival',
    example: 'Festival de Música Viña del Mar 2024',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'El nombre no puede exceder los 50 caracteres.' })
  @Matches(/^[A-Za-záéíóúÁÉÍÓÚñÑ0-9\s]+$/, {
    message: 'El nombre solo puede contener letras, números y espacios',
  })
  name?: string;

  @ApiProperty({
    description: 'La ubicación del festival',
    example: 'Parque Central, Ciudad',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, {
    message: 'La ubicación no puede exceder los 100 caracteres.',
  })
  @Matches(/^[a-zA-Z0-9\s,-]+$/, {
    message:
      'La ubicación solo puede contener letras, números, espacios, comas, y guiones',
  })
  location?: string;

  @ApiProperty({
    description: 'La fecha del festival en formato YYYY-MM-DD | HH:mm',
    example: '2024-11-15 | 15:30',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La fecha debe ser una cadena' })
  @Matches(/^\d{4}-\d{2}-\d{2} \| \d{2}:\d{2}$/, {
    message: 'La fecha debe ser una cadena en formato YYYY-MM-DD | HH:mm.',
  })
  date?: string;

  @ApiProperty({
    description: 'Una descripción breve del festival',
    example:
      'Un festival anual de música con artistas locales e internacionales.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200, {
    message: 'La descripción no puede exceder los 200 caracteres.',
  })
  @MinLength(10, {
    message: 'La descripción debe tener al menos 10 caracteres.',
  })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,;:'"()¿?¡!-]+$/, {
    message:
      'La descripción solo puede contener letras, números, espacios y signos de puntuación comunes.',
  })
  description?: string;
}
