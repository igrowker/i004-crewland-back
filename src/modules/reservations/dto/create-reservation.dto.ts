import { ApiProperty } from "@nestjs/swagger";
import {
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsUUID,
} from "class-validator";
import { Type } from "src/shared/utils/enum";


export class CreateReservationDto {
    @ApiProperty({
        description: 'Tipo de reserva (crew/transporte/estancia)',
        enum: Type,
    })
    @IsNotEmpty({ message: 'El tipo es un campo requerido.' })
    @IsEnum(Type, { message: 'El tipo debe ser crew, transport, accomodation.' })
    type: Type;

    @ApiProperty({
        description: 'El ID del post.',
        type: 'string',
        format: 'uuid',
    })
    @IsNotEmpty({ message: 'El ID del post es un campo requerido.' })
    @IsUUID('4', { message: 'El ID del post debe ser un UUID válida' })
    postId: string;

    @ApiProperty({
        description: 'Array de IDs de usuario que inicialian la reserva.',
        type: [String],
        required: false,
    })
    @IsArray()
    @IsUUID('4', {
        each: true,
        message: 'Each user ID must be a valid UUID.'
    })
    @IsOptional()
    userIds?: string[];
}
