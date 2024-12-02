import { ApiProperty } from "@nestjs/swagger";
import {
    IsArray,
    IsNotEmpty,
    IsUUID,
    ArrayNotEmpty
} from "class-validator";


export class ReservationAddUsersDto {
    @ApiProperty({
        description: 'IDs de los nuevos usuarios que se añaden a la reserva en conjunto',
        example: ['987f6543-e21d-45c9-a123-426614174000', '876e5432-d10c-32a8-c321-326614174000'],
        type: 'array',
        items: { type: 'string', format: 'uuid' }
    })
    @IsArray()
    @ArrayNotEmpty({ message: 'El array con las ids de usuario no puede estar vacío.' })
    @IsUUID('4', {
        each: true,
        message: 'El Id del usuario debe ser una uuid válida.',
    })
    userIds: string[]
}