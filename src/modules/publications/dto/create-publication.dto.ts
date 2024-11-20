import { IsString, IsNotEmpty, IsEnum, IsUUID, IsDate, MaxLength, IsDateString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'src/shared/utils/enum';

export class CreatePublicationDto {
    @ApiProperty({
        description: 'ID del usuario que crea la publicación',
        example: '4ca24b91-70c2-43ca-aee9-4f54b8f8erc5',
    })
    @IsString({ message: 'El userId debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El ID del usuario es obligatorio.' })
    @IsUUID(undefined, { message: 'El ID del usuario debe ser un UUID válido.' })
    userId: string

    // @ApiProperty({
    //     description: 'Título de la publicación, puede ser cualquier texto descriptivo.',
    //     example: 'Oferta de transporte',
    //   })
    //   @IsString({ message: 'El título debe ser una cadena de texto.' })
    //   @IsNotEmpty({ message: 'El título de la publicación es obligatorio.' })
    //   @MinLength(1, { message: 'El título debe tener al menos 1 carácter.' })
    //   @MaxLength(60, { message: 'El título no puede tener más de 60 caracteres.' })
    //   title: string;

    @ApiProperty({
        description: 'Tipo de publicación: Crew, Transport, o Accommodation',
        example: 'crew',
    })
    @IsString({ message: 'El Type debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El tipo de publicación es obligatorio.' })
    @IsEnum(Type, { message: 'El tipo de publicación debe ser uno de estos: crew, transport, accommodation' })
    type: Type

    @ApiProperty({
        description: 'ID del festival al que pertenece la publicación',
        example: 'b56c0a27-9bfe-4f1c-bfd4-973d287fe0b1',
    })
    @IsString({ message: 'El FestivalId debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El ID del festival es obligatorio.' })
    @IsUUID(undefined, { message: 'El ID del festival debe ser un UUID válido.' })
    festivalId: string

    @ApiProperty({
        description: 'Detalles adicionales sobre la publicación',
        example: 'Se necesita un técnico de sonido para el festival',
    })
    @IsString({ message: 'Los detalles deben ser una cadena de texto.' })
    @IsNotEmpty({ message: 'Los detalles de la publicación son obligatorios.' })
    @MaxLength(250, { message: 'La descripción no puede tener más de 250 caracteres' })
    details: string

    @ApiProperty({
        description: 'Disponibilidad para la publicación (por ejemplo, 9am - 5pm)',
        example: '9am - 5pm',
    })
    @IsNotEmpty({ message: 'La disponibilidad es obligatoria.' })
    @IsString({ message: 'La disponibilidad debe ser una cadena de texto.' })
    @MinLength(1, { message: 'La disponibilidad debe tener al menos 1 carácter.' })
    @MaxLength(50, { message: 'La disponibilidad no puede tener más de 50 caracteres.' })
    // @Matches(/^\d{1,2}(am|pm)\s?-\s?\d{1,2}(am|pm)$/i, { message: 'La disponibilidad debe seguir el formato: 9am - 5pm' })
    availability: string;

    @ApiProperty({
        description: 'Fecha de creación de la publicación',
        example: '2024-11-18T12:30:00Z',
    })
    @IsDate({ message: 'La fecha de creación debe ser una fecha válida.' })
    @IsNotEmpty({ message: 'La fecha de creación es obligatoria.' })
    dateCreation: Date
}
