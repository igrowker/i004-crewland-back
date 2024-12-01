import {
    IsArray,
    IsDateString,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { Gender, Role } from 'src/shared/utils/enum';
import { IsPastDate } from 'src/shared/decorators/age.decorators';

export const NameProperty = () =>
    applyDecorators(
        ApiProperty({
            description: 'Nombre del usuario',
            example: 'Juan',
        }),
        IsString({ message: 'El nombre debe ser una cadena de texto.' }),
        IsNotEmpty({ message: 'El nombre es obligatorio.' }),
        MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),
        MaxLength(50, { message: 'El nombre no puede tener más de 50 caracteres.' }),
        Matches(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/, {
            message: 'El nombre debe contener solo letras y espacios.',
        }),
    );

export const UsernameProperty = () =>
    applyDecorators(
        ApiProperty({
            description: 'Nombre de usuario',
            example: 'juan123',
        }),
        IsString({ message: 'El nombre de usuario debe ser una cadena de texto.' }),
        IsNotEmpty({ message: 'El nombre de usuario es obligatorio.' }),
        MinLength(4, { message: 'El nombre de usuario debe tener al menos 4 caracteres.' }),
        MaxLength(25, { message: 'El nombre de usuario no puede tener más de 25 caracteres.' }),
        Matches(/^[a-zA-Z0-9_-]+$/, {
            message:
                'El nombre de usuario solo permite letras (a-z, A-Z), números (0-9), guiones bajos (_) y guiones medios (-).',
        }),
    );

export const EmailProperty = () =>
    applyDecorators(
        ApiProperty({
            description: 'Correo electrónico del usuario',
            example: 'juan.perez@example.com',
        }),
        IsNotEmpty({ message: 'El correo electrónico es obligatorio.' }),
        IsEmail({}, {
            message: 'El correo electrónico debe ser una dirección válida.',
        }),
        MaxLength(70, {
            message: 'El correo electrónico no puede tener más de 70 caracteres.',
        }),
    );

export const PasswordProperty = () =>
    applyDecorators(
        ApiProperty({
            description: 'Contraseña del usuario',
            example: 'MyStrongP@ssw0rd',
        }),
        IsString({ message: 'La contraseña debe ser una cadena de texto.' }),
        IsNotEmpty({ message: 'La contraseña es obligatoria.' }),
        MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' }),
        MaxLength(30, { message: 'La contraseña no puede tener más de 30 caracteres.' }),
        Matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,30}$/,
            {
                message:
                    'La contraseña debe tener entre 8 y 30 caracteres, incluir al menos una mayúscula, una minúscula, un número y un carácter especial.',
            },
        ),
    );

export const PhoneNumberProperty = () =>
    applyDecorators(
        ApiProperty({
            description: 'Número de teléfono del usuario',
            example: '+1 (555) 123-4567',
        }),
        IsString({ message: 'El número de teléfono debe ser una cadena de texto.' }),
        IsNotEmpty({ message: 'El número de teléfono es obligatorio.' }),
        Matches(
            /^(?:\+?\d{1,3}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/,
            {
                message: 'El número de teléfono no tiene un formato válido.',
            },
        ),
    );

export const DateOfBirthProperty = () =>
    applyDecorators(
        ApiProperty({
            description: 'Fecha de nacimiento del usuario',
            example: '2000-01-01',
        }),
        IsDateString({}, { message: 'La fecha debe ser en formato ISO (YYYY-MM-DD).' }),
        IsPastDate({ message: 'La fecha debe ser del pasado.' }),
    );

export const GenderProperty = () =>
    applyDecorators(
        ApiProperty({
            description: 'Género del usuario',
            example: 'Masculino',
            enum: Gender,
        }),
        IsEnum(Gender, { message: 'El género debe ser uno de los valores definidos.' }),
        IsNotEmpty({ message: 'El género es obligatorio.' }),
    );

export const RoleProperty = () =>
    applyDecorators(
        ApiProperty({
            description: 'Rol del usuario',
            example: 'User',
            required: false,
        }),
        IsEnum(Role, { message: "El rol debe ser 'Admin' o 'User'" }),
    );

export const ArrayOfStringsProperty = () =>
    applyDecorators(
        IsArray(),
        IsOptional(),
        IsString({ each: true }),
    );