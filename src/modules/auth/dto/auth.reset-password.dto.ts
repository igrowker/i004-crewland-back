import { ApiProperty } from "@nestjs/swagger";
import {
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
    Matches
} from "class-validator";


export class ResetPasswordDto {
    @ApiProperty({
        description: 'Nueva contraseña para el usuario',
        example: 'MyNewP@ssword1',
    })
    @IsString()
    @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
    @MinLength(8, { message: 'La contraseña debe tener un mínimo de 8 caracteres.' })
    @MaxLength(30, { message: 'El número máximo de dígitos ha sido excedido' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,30}$/, {
        message: 'La contraseña debe tener entre 8 y 30 caracteres, incluir al menos una mayúscula, una minúscula, un número y un carácter especial.',
    })
    newPassword: string

    @ApiProperty({
        description: 'Repita la nueva contraseña',
        example: 'MyNewP@ssword1',
    })
    @IsString()
    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    @MinLength(8, { message: 'La contraseña debe tener un mínimo de 8 caracteres.' })
    @MaxLength(30, { message: 'El número máximo de dígitos ha sido excedido.' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,30}$/, {
        message: 'La contraseña debe tener entre 8 y 30 caracteres, incluir al menos una mayúscula, una minúscula, un número y un carácter especial.',
    })
    repeatPassword: string;
}