import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsUUID,
  IsDate,
  MaxLength,
  MinLength,
  IsOptional,
  Matches
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'src/shared/utils/enum';

export class CreatePublicationDto {
  // @ApiProperty({
  //   description: 'ID del usuario que crea la publicación',
  //   example: '4ca24b91-70c2-43ca-aee9-4f54b8f8erc5',
  // })
  // @IsString({ message: 'El userId debe ser una cadena de texto.' })
  // @IsNotEmpty({ message: 'El ID del usuario es obligatorio.' })
  // @IsUUID(undefined, { message: 'El ID del usuario debe ser un UUID válido.' })
  // userId: string

  @ApiProperty({
    description: 'Título de la publicación, puede ser cualquier texto descriptivo.',
    example: 'Oferta de transporte',
  })
  @IsString({ message: 'El título debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El título de la publicación es obligatorio.' })
  @MinLength(1, { message: 'El título debe tener al menos 1 carácter.' })
  @MaxLength(60, { message: 'El título no puede tener más de 60 caracteres.' })
  title: string;

  @ApiProperty({
    description: 'Tipo de publicación: Crew, Transport, o Accommodation',
    example: 'crew',
  })
  @IsString({ message: 'El Type debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El tipo de publicación es obligatorio.' })
  @IsEnum(Type, {
    message:
      'El tipo de publicación debe ser uno de estos: crew, transport, accommodation',
  })
  type: Type;

  @ApiProperty({
    description: 'ID del festival al que pertenece la publicación',
    example: 'b56c0a27-9bfe-4f1c-bfd4-973d287fe0b1',
  })
  @IsString({ message: 'El FestivalId debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El ID del festival es obligatorio.' })
  @IsUUID(undefined, { message: 'El ID del festival debe ser un UUID válido.' })
  festivalId: string;

  @ApiProperty({
    description: 'Detalles adicionales sobre la publicación',
    example: 'Se necesita un técnico de sonido para el festival',
  })
  @IsString({ message: 'Los detalles deben ser una cadena de texto.' })
  @IsNotEmpty({ message: 'Los detalles de la publicación son obligatorios.' })
  @MaxLength(250, {
    message: 'La descripción no puede tener más de 250 caracteres',
  })
  details: string;

  @ApiProperty({
    description: 'Número máximo de participantes permitidos para la publicación',
    example: 10,
  })
  @IsNotEmpty({ message: 'El número máximo de participantes es obligatorio.' })
  maxParticipants: number;

  @ApiProperty({
    description: 'Lista de usernames de los participantes',
    example: ['usuario1', 'usuario2'],
  })
  @IsOptional()
  participants?: string[];

  @ApiProperty({
    description: 'Fecha de creación de la publicación (solo día)',
    example: '15-12-1998',
    required: false,
  })
  @IsString({ message: 'La fecha de creación debe ser una cadena en formato DD-MM-YYYY.' })
  @Matches(/^\d{2}-\d{2}-\d{4}$/, { message: 'La fecha debe ser en formato DD-MM-YYYY.' })
  @IsOptional()  // Hacemos la fecha opcional
  creationDate: string;  // Solo la parte de la fecha (día)

  @ApiProperty({
    description: 'Hora de creación de la publicación',
    example: '14:42',
    required: false,
  })
  @IsString({ message: 'La hora de creación debe ser una cadena en formato HH:mm.' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'La hora debe estar en formato HH:mm.' })
  @IsOptional()  // Hacemos la hora opcional
  creationTime: string; // Solo la parte de la hora

  @ApiProperty({
    description: 'URL de la imagen asociada a la publicación',
    example: 'https://mi-servidor.com/imagenes/imagen.jpg',
  })
  @IsString({ message: 'La URL de la imagen debe ser una cadena de texto.' })
  @IsOptional()
  imageUrl?: string;
}
