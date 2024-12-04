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
  IsDateString,
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
  @MaxLength(50, {
    message: 'La ubicación no puede exceder los 50 caracteres.',
  })
  @Matches(/^(?=.*[a-zA-ZáéíóúÁÉÍÓÚñÑ])[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s,-]{3,}$/, {
    message:
      'La ubicación debe contener al menos una letra, no puede ser solo números o espacios, y solo puede contener letras, números, espacios, comas, tildes y guiones',
  })
  location?: string;

  @ApiProperty({
    description: 'La fecha del festival en formato YYYY-MM-DD',
    example: '2024-11-15',
    required: false,
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'La fecha debe ser valida y en formato de cadena' },
  )
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
  time?: string;

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
      'La descripción solo puede contener letras, números, espacios, tildes, y signos de puntuación comunes.',
  })
  description?: string;

  @ApiProperty({
    description: 'URL del sitio web del festival',
    example: 'https://www.festivalexample.com',
    required: false,
  })
  @IsOptional()
  @IsUrl(
    { protocols: ['http', 'https'], require_protocol: true },
    { message: 'Debe ser una URL válida que comience con http:// o https://' },
  )
  url?: string;

  @ApiProperty({
    description: 'Número de personas que asistirán al festival',
    example: 5000,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'Debe ser un número entero' })
  @Min(1, { message: 'Debe haber al menos una persona asistiendo' })
  attendeesCount?: number;

  @ApiProperty({
    description: 'Archivos de imagines del festival para upload (opcional)',
    example: ['image1.jpg', 'image2.jpg'],
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
  })
  @IsOptional()
  images?: Array<Express.Multer.File>;

  @ApiProperty({
    description: 'URL/s de las imágenes del festival',
    example: [
      'https://example.com/festival-image1.jpg',
      'https://example.com/festival-image2.jpg',
    ],
    type: 'array',
    items: { type: 'string' },
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  @IsUrl(
    { protocols: ['http', 'https'], require_protocol: true },
    {
      each: true,
      message:
        'Cada elemento debe ser una URL válida que comience con http:// o https://',
    },
  )
  imageUrls?: string[];
}
