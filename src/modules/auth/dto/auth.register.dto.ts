import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsEmail, MinLength, MaxLength, Matches } from "class-validator";

export class AuthRegisterDto {
    @ApiProperty({
        description: 'Nombre del usuario',
        example: 'Juan',
    })
    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    @MinLength(1, { message: 'El nombre debe tener al menos 1 caracter.' })
    @MaxLength(50, { message: 'El número máximo de caracteres ha sido excedido.' })
    @Matches(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/, {
        message: 'El nombre debe contener sólo letras y espacios'
    })
    name: string;

    @ApiProperty({
        description: 'Nombre de Usuario',
        example: 'Juan',
    })
    @IsString()
    @IsNotEmpty({ message: 'Usuario es obligatorio' })
    @MinLength(1, { message: 'El nombre debe tener al menos 1 caracter.' })
    @MaxLength(50, { message: 'El número máximo de caracteres ha sido excedido.' })
    @Matches(/^[a-zA-Z0-9_-]+$/, {
        message: 'El nombre debe contener sólo letras y espacios',
    })
    username: string;

    @ApiProperty({
        description: 'Correo electrónico del usuario',
        example: 'juan.perez@example.com',
    })
    @IsNotEmpty({ message: 'Correo electrónico es obligatorio' })
    @IsEmail(
        {},
        {
            message:
                'El correo electrónico debe ser una dirección de correo válida y tener un dominio permitido.',
        },
    )
    @MinLength(1, { message: 'El correo electrónico debe tener al menos 1 caracter.' })
    @MaxLength(70, {
        message: 'El número máximo de caracteres ha sido excedido.',
    })
    email: string;

    @ApiProperty({
        description: 'Número de teléfono del usuario',
        example: '+1 (555) 123-4567',
    })
    @IsString()
    @IsNotEmpty({ message: 'El número de teléfono es obligatorio.' })
    @Matches(
        /^(?:\+?\d{1,3}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/,
        {
            message: 'El número de teléfono no tiene un formato válido.',
        },
    )
    tel: string;

    @ApiProperty({
        description: 'Contraseña del usuario',
        example: 'MyStrongP@ssw0rd',
    })
    @IsString()
    @IsNotEmpty({ message: 'La contraseña es obligatorio' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
    @MaxLength(30, { message: 'El número máximo de caracteres ha sido excedido.' })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,30}$/,
        {
            message:
                'La contraseña debe tener entre 8 y 30 caracteres, incluir al menos una mayúscula, una minúscula, un número y un carácter especial.',
        },
    )
    password: string;

    @ApiProperty({
        description: 'Confirmación de la contraseña',
        example: 'MyStrongP@ssword',
    })
    @IsString()
    @IsNotEmpty({ message: 'La confirmación de contraseña es obligatoria.' })
    confirmPassword: string
}