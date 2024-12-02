import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";


export class ReservationAddUserDto {
    @ApiProperty({
        description: 'ID del nuevo usuario que se añade a la reserva',
        example: '987f6543-e21d-45c9-a123-426614174000',
        type: 'string',
        format: 'uuid',
    })
    @IsNotEmpty({ message: 'El Id del usuario no puede estar vacío.' })
    @IsUUID('4', {
        message: 'El Id del usuario debe ser una uuid válida.'
    })
    userId: string
}