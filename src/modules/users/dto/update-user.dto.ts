import {
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../../../shared/utils/enum';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(1, { message: 'El nombre debe tener al menos 1 carácter.' })
  @MaxLength(50, {
    message: 'El número máximo de caracteres ha sido excedido.',
  })
  @Matches(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/, {
    message: 'El nombre debe contener sólo letras y espacios',
  })
  name?: string;

  @ApiProperty({
    description: 'Nombre de Usuario',
    example: 'Juan',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(1, { message: 'El nombre debe tener al menos 1 carácter.' })
  @MaxLength(50, {
    message: 'El número máximo de caracteres ha sido excedido.',
  })
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'El nombre de usuario debe contener sólo letras y espacios',
  })
  username?: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@example.com',
    required: false,
  })
  @IsEmail(
    {},
    {
      message:
        'El correo electrónico debe ser una dirección válida y tener un dominio permitido.',
    },
  )
  @IsOptional()
  @MaxLength(70, {
    message: 'El número máximo de caracteres ha sido excedido.',
  })
  email?: string;

  @ApiProperty({
    description: 'Número de teléfono del usuario',
    example: '+1 (555) 123-4567',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Matches(
    /^(?:\+?\d{1,3}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/,
    {
      message: 'El número de teléfono no tiene un formato válido.',
    },
  )
  tel?: string;

  @ApiProperty({
    description: 'Fecha de nacimiento del usuario',
    example: '2000-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message:
        'La fecha debe ser una fecha válida en formato ISO (YYYY-MM-DD).',
    },
  )
  age?: string;

  @ApiProperty({
    description: 'Género del usuario',
    example: 'no especifica',
    enum: Gender,
    required: false,
  })
  @IsEnum(Gender)
  @IsOptional()
  gender?: string;

  @ApiProperty({
    description: 'Preferencias del usuario',
    example: ['playa', 'montaña'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  preferences?: string[];

  @ApiProperty({
    description: 'Historial de viajes del usuario',
    example: ['París', 'Roma'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  travelHistory?: string[];

  @ApiProperty({
    description: 'Favoritos del usuario',
    example: ['hotel1', 'restaurante2'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  password: any;
}
