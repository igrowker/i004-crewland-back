import { ApiProperty } from '@nestjs/swagger'
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MaxLength,
} from 'class-validator'

export class RestorePasswordEmailDto {
    @ApiProperty({
        description: 'Correo electronico del usuario',
        example: 'juanperez@example.com',
    })
    @IsString()
    @IsNotEmpty({ message: 'El email es obligatorio' })
    @IsEmail(
        {},
        {
            message: 'El email debe ser un correo válido'
        }
    )
    @MaxLength(70, {
        message:
            'El correo debe tener un formato válido(sin espacios y con un dominio correcto).'
    })
    email: string
}