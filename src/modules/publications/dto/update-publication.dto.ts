import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsUUID,
  IsDate,
  MaxLength,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { CreatePublicationDto } from './create-publication.dto';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'src/shared/utils/enum';

export class UpdatePublicationDto extends PartialType(CreatePublicationDto) {
  @ApiProperty({
    description:
      'Tipo de publicación: Crew, Transport, o Accommodation (opcional)',
    example: 'crew',
    required: false,
  })
  @IsString({ message: 'El tipo debe ser una cadena de texto.' })
  @IsOptional()
  @IsEnum(Type, {
    message:
      'El tipo de publicación debe ser uno de estos: crew, transport, accommodation',
  })
  type?: Type;

  @ApiProperty({
    description: 'ID del festival al que pertenece la publicación (opcional)',
    example: 'b56c0a27-9bfe-4f1c-bfd4-973d287fe0b1',
    required: false,
  })
  @IsString({ message: 'El FestivalId debe ser una cadena de texto.' })
  @IsOptional()
  @IsUUID(undefined, { message: 'El ID del festival debe ser un UUID válido.' })
  festivalId?: string;

  @ApiProperty({
    description: 'Detalles adicionales sobre la publicación (opcional)',
    example: 'Se necesita un técnico de sonido para el festival',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Los detalles deben ser una cadena de texto.' })
  @MaxLength(250, {
    message: 'La descripción no puede tener más de 250 caracteres',
  })
  details?: string;

  @ApiProperty({
    description: 'Disponibilidad para la publicación (opcional)',
    example: '9am - 5pm',
    required: false,
  })
  @IsOptional()
  @IsString({
    message: 'La disponibilidad debe ser una fecha válida en formato 9am - 5pm',
  }) //chequear como va a ser el formato de availability
  availability?: string;
}
