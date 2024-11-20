import { IsEmail, Matches, IsString, IsNotEmpty, MinLength, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AuthLoginDto {
    // usar correo electronico o username, el que se prefiera
    @ApiProperty({
        description: 'Correo electrónico del usuario',
        example: 'juan.perez@example.com',
    })
    @IsNotEmpty({ message: 'El correo electrónico no puede estar vacío.' })
    @IsEmail(
        {},
        {
            message:
                'El correo electrónico debe ser una dirección valida y un dominio permitido.',
        },
    )
    @MinLength(1, { message: 'El correo debe tener al menos 1 caracteres.' })
    @MaxLength(70, { message: 'El numero máximo de caracteres ha sido excedido.' })
    email: string

    @ApiProperty({
        description: 'Contraseña del usuario',
        example: 'MyStrongP@ssword',
    })
    @IsString()
    @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
    @MaxLength(30, { message: 'El número máximo de caracteres ha sido excedido.' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,30}$/,
        { message: 'La contraseña debe tener entre 8 y 30 caracteres, incluir al menos una mayúscula, una minúscula, un número y un carácter especial.' }
    )
    password: string
}
