import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";


export class ReservationAddUserDto {
    @ApiProperty({
        description: 'ID de la reserva a la que se va a añadir un usuario',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: 'string',
        format: 'uuid',
    })
    @IsNotEmpty({ message: 'La Id de la reserva no puede estar vacía.' })
    @IsUUID('4',
        {
            message: 'La Id de la reserva debe ser una uuid válida.'
        })
    reservationId: string

    @ApiProperty({
        description: 'ID del nuevo usuario que se añade a la reserva',
        example: '987f6543-e21d-45c9-a123-426614174000',
        type: 'string',
        format: 'uuid',
    })
    @IsNotEmpty({ message: 'La Id del usuario no puede estar vacía.' })
    @IsUUID('4', {
        message: 'La Id del usuario debe ser una uuid válida.'
    })
    userId: string
}