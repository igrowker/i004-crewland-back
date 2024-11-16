import { IsString, IsNotEmpty, IsEnum, IsUUID, IsDate, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePublicationDto {
    @ApiProperty({
        description: 'ID del usuario que crea la publicación',
        example: '4ca24b91-70c2-43ca-aee9-4f54b8f8erc5',
    })
    @IsNotEmpty()
    @IsUUID()
    userId: string

    //   @ApiProperty({
    //     description: 'Título de la publicación, puede ser "search" o "offer"',
    //     example: 'search',
    //   })
    //   @IsNotEmpty()
    //   @IsEnum(['search', 'offer'], { message: 'El título debe ser "search" o "offer"' })
    //   title: 'search' | 'offer'

    @ApiProperty({
        description: 'Tipo de publicación: Crew, Transport, o Accommodation',
        example: 'crew',
    })
    @IsString()
    @IsNotEmpty()
    @IsEnum(['crew', 'transport', 'accommodation'], { message: 'El tipo de publicación debe ser uno de estos: crew, transport, accommodation' })
    type: 'crew' | 'transport' | 'accommodation'

    @ApiProperty({
        description: 'ID del festival al que pertenece la publicación',
        example: 'b56c0a27-9bfe-4f1c-bfd4-973d287fe0b1',
    })
    @IsNotEmpty()
    @IsUUID()
    festivalId: string

    @ApiProperty({
        description: 'Detalles adicionales sobre la publicación',
        example: 'Se necesita un técnico de sonido para el festival',
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(250, { message: 'La descripción no puede tener más de 250 caracteres' })
    details: string

    @ApiProperty({
        description: 'Disponibilidad para la publicación (por ejemplo, 9am - 5pm)',
        example: '9am - 5pm',
    })
    @IsNotEmpty()
    @IsString()
    availability: string

    @ApiProperty({
        description: 'Fecha de creación de la publicación',
        example: '2024-10-12',
    })
    @IsDate()
    @IsNotEmpty()
    dateCreation: Date
}
