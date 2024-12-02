import { ApiProperty } from "@nestjs/swagger";
import {
    IsNotEmpty,
    IsUUID
} from "class-validator";


export class ReservationRemoveUserDto {
    @ApiProperty({
        description: 'ID del usuario que se eliminará a la reserva',
        example: '987f6543-e21d-45c9-a123-426614174000',
        type: 'string',
        format: 'uuid',
    })
    @IsNotEmpty({ message: 'El Id del usuario no puede estar vacío.' })
    @IsUUID('4', {
        message: 'La Id del usuario debe ser una uuid válida.'
    })
    userId: string
}