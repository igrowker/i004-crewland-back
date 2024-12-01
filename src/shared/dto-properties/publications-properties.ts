import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  MaxLength,
  MinLength,
  Matches,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Type } from '../utils/enum';

export const TitleProperty = () =>
  applyDecorators(
    ApiProperty({
      description: 'Título de la publicación, puede ser cualquier texto descriptivo.',
      example: 'Oferta de transporte',
    }),
    IsString({ message: 'El título debe ser una cadena de texto.' }),
    IsNotEmpty({ message: 'El título de la publicación es obligatorio.' }),
    MinLength(1, { message: 'El título debe tener al menos 1 carácter.' }),
    MaxLength(60, { message: 'El título no puede tener más de 60 caracteres.' }),
  );

export const TypeProperty = () =>
  applyDecorators(
    ApiProperty({
      description: 'Tipo de publicación: Crew, Transport, o Accommodation',
      example: 'crew',
    }),
    IsString({ message: 'El Type debe ser una cadena de texto.' }),
    IsNotEmpty({ message: 'El tipo de publicación es obligatorio.' }),
    IsEnum(Type, {
      message: 'El tipo de publicación debe ser uno de estos: crew, transport, accommodation',
    }),
  );

export const FestivalIdProperty = () =>
  applyDecorators(
    ApiProperty({
      description: 'ID del festival al que pertenece la publicación',
      example: 'b56c0a27-9bfe-4f1c-bfd4-973d287fe0b1',
    }),
    IsString({ message: 'El FestivalId debe ser una cadena de texto.' }),
    IsNotEmpty({ message: 'El ID del festival es obligatorio.' }),
    IsUUID(undefined, { message: 'El ID del festival debe ser un UUID válido.' }),
  );

export const DetailsProperty = () =>
  applyDecorators(
    ApiProperty({
      description: 'Detalles adicionales sobre la publicación',
      example: 'Se necesita un técnico de sonido para el festival',
    }),
    IsString({ message: 'Los detalles deben ser una cadena de texto.' }),
    IsNotEmpty({ message: 'Los detalles de la publicación son obligatorios.' }),
    MaxLength(250, { message: 'La descripción no puede tener más de 250 caracteres' }),
  );

export const MaxParticipantsProperty = () =>
  applyDecorators(
    ApiProperty({
      description: 'Número máximo de participantes permitidos para la publicación',
      example: 10,
    }),
    IsNotEmpty({ message: 'El número máximo de participantes es obligatorio.' }),
  );

export const ParticipantsProperty = () =>
  applyDecorators(
    ApiProperty({
      description: 'Lista de usernames de los participantes',
      example: ['usuario1', 'usuario2'],
    }),
    IsOptional(),
  );

export const CreationDateProperty = () =>
  applyDecorators(
    ApiProperty({
      description: 'Fecha de creación de la publicación (solo día)',
      example: '15-12-1998',
      required: false,
    }),
    IsString({ message: 'La fecha de creación debe ser una cadena en formato DD-MM-YYYY.' }),
    Matches(/^\d{2}-\d{2}-\d{4}$/, { message: 'La fecha debe ser en formato DD-MM-YYYY.' }),
    IsOptional(),
  );

export const CreationTimeProperty = () =>
  applyDecorators(
    ApiProperty({
      description: 'Hora de creación de la publicación',
      example: '14:42',
      required: false,
    }),
    IsString({ message: 'La hora de creación debe ser una cadena en formato HH:mm.' }),
    Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'La hora debe estar en formato HH:mm.' }),
    IsOptional(),
  );

export const ImageUrlProperty = () =>
  applyDecorators(
    ApiProperty({
      description: 'URL de la imagen asociada a la publicación',
      example: 'https://mi-servidor.com/imagenes/imagen.jpg',
    }),
    IsString({ message: 'La URL de la imagen debe ser una cadena de texto.' }),
    IsOptional(),
  );