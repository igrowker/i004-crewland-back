import { PartialType } from '@nestjs/mapped-types';
import { CreateFestivalDto } from './create-festival.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
  IsUrl,
  IsInt,
  Min,
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
    description: 'La fecha del festival en formato YYYY-MM-DD',
    example: '2024-11-15',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La fecha debe ser una cadena' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'La fecha debe ser una cadena en formato YYYY-MM-DD',
  })
  date?: string;

  @ApiProperty({
    description: 'La hora del festival en formato HH:mm',
    example: '20:00',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La hora debe ser una cadena' })
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'La hora debe estar en formato HH:mm (24 horas).',
  })
  time: string;

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

  @ApiProperty({
    description: 'URL del sitio web del festival',
    example: 'https://www.festivalexample.com',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'Debe ser una URL válida' })
  url?: string;

  // Campo número de asistentes opcional
  @ApiProperty({
    description: 'Número de personas que asistirán al festival',
    example: 5000,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'Debe ser un número entero' })
  @Min(1, { message: 'Debe haber al menos una persona asistiendo' })
  attendeesCount?: number;
}
