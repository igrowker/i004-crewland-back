import { ApiProperty } from "@nestjs/swagger";
import {
    IsNotEmpty,
    IsEnum,
} from "class-validator";
import { Type } from "src/shared/utils/enum";


export class ReservationUpdateTypeDto {
    @ApiProperty({
        description: 'Nuevo tipo asociado a la reserva.',
        enum: Type,
        example: Type.Crew,
    })
    @IsNotEmpty({ message: 'El tipo de la reserva es un campo requerido.' })
    @IsEnum(Type, {
        message: `El tipo del a reserva debe ser ${Type.Crew}, ${Type.Accommodation}, ${Type.Transport}.`,
    })
    type: Type
}