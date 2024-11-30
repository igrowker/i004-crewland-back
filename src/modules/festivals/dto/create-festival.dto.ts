import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  Matches,
  MinLength,
  IsUrl,
  IsInt,
  Min,
  IsOptional,
} from 'class-validator';

export class CreateFestivalDto {
  @ApiProperty({
    description: 'El nombre del festival',
    example: 'Festival de Música Viña del Mar 2024',
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre del festival es obligatorio' })
  @MinLength(3)
  @MaxLength(50, { message: 'El nombre no puede exceder los 50 caracteres.' })
  @Matches(/^[A-Za-záéíóúÁÉÍÓÚñÑ0-9\s]+$/, {
    message: 'El nombre solo puede contener letras, números y espacios',
  })
  name: string;

  @ApiProperty({
    description: 'La ubicación del festival',
    example: 'Parque Central, Ciudad',
  })
  @IsString()
  @IsNotEmpty({ message: 'La ubicación es obligatoria' })
  @MinLength(3)
  @MaxLength(50, {
    message: 'La ubicación no puede exceder los 50 caracteres.',
  })
  @Matches(/^[a-zA-Z0-9\s,-]+$/, {
    message:
      'La ubicación solo puede contener letras, números, espacios, comas, y guiones',
  })
  location: string; // agregar propiedad para evitar que se envien solo numeros evitar que se envien solo espacios tambien.
  // tampoco esta acepatando tildes.

  @ApiProperty({
    description: 'La fecha del festival en formato YYYY-MM-DD',
    example: '2024-11-15',
  })
  @IsString({ message: 'La fecha debe ser una cadena' })
  @IsNotEmpty({ message: 'La fecha es obligatoria' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'La fecha debe ser una cadena en formato YYYY-MM-DD.',
  })
  date: string;
  // agregar validacion para que no se puedan mandar fechas pasadas.
  // tambien verificar que se manden fechas existentes

  @ApiProperty({
    description: 'La hora del festival en formato HH:mm',
    example: '20:00',
  })
  @IsString({ message: 'La hora debe ser una cadena' })
  @IsNotEmpty({ message: 'La hora es obligatoria' })
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'La hora debe estar en formato HH:mm (24 horas).',
  })
  time: string;

  @ApiProperty({
    description: 'Una descripción breve del festival',
    example:
      'Un festival anual de música con artistas locales e internacionales.',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
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
  description: string; // a revisar.

  @ApiProperty({
    description: 'URL del sitio web del festival',
    example: 'https://www.festivalexample.com',
  })
  @IsUrl({}, { message: 'Debe ser una URL válida' })
  url: string;
  // a chekear que urls permite. AGREGAR VALIDACIONES PARA LA URL

  @ApiProperty({
    description: 'Número de personas que asistirán al festival',
    example: 5000,
  })
  @IsInt({ message: 'Debe ser un número entero' })
  @Min(1, { message: 'Debe haber al menos una persona asistiendo' })
  attendeesCount: number;

  @ApiProperty({
    description: 'Archivos de imagines del festival para upload (opcional)',
    example: ['image1.jpg', 'image2.jpg'],
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  images?: Array<Express.Multer.File>;

  @ApiProperty({
    description: 'URL/s de las imagenes del festival',
    example: 'https://example.com/image1.jpg',

    type: 'array',
    items: { type: 'string' },
  })
  @IsOptional()
  // @IsArray()
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  imageUrls?: string[];
}

// me esta dejando crear por mas que exista el post. no permitir crear el mismo evento.
