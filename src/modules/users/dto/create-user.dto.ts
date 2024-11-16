import { MaxLength } from 'class-validator';
import { Matches } from 'class-validator';
import { MinLength } from 'class-validator';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsNotEmpty({ message: 'Nombre es obligatorio' })
  @MinLength(1, { message: 'La nombre debe tener al menos 1 caracteres.' })
  @MaxLength(50, { message: 'El número máximo de dígitos ha sido excedido.' })
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'El nombre debe contener sólo letras y espacios',
  })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Correo electrónico es obligatorio' })
  @IsEmail(
    {},
    {
      message:
        'El correo electrónico debe ser una dirección de correo válida y tener un dominio permitido.',
    },
  )
  @MinLength(1, { message: 'El email tiene que tener como minimo de 1.' })
  @MaxLength(70, {
    message: 'El número máximo de caracteres ha sido excedido.',
  })
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message:
      'El correo debe tener un formato válido (sin espacios y con un dominio correcto).',
  })
  email: string;

  //DATO: puse q la contraseña tenga q tener una letra mayuscula, una minuscula, un numero y un caracter especial como obligatorio pero se puede cambiar
  @IsString()
  @IsNotEmpty({ message: 'Contraseña es obligatorio' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @MaxLength(30, { message: 'El número máximo de caracteres fue excedido.' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,30}$/,
    {
      message:
        'La contraseña debe tener entre 8 y 30 caracteres, incluir al menos una mayúscula, una minúscula, un número y un carácter especial.',
    },
  )
  password: string;

  @IsOptional()
  age?: number = 18;

  @IsNotEmpty() //el genero si bien nos viene desde el front asignarle algun valor por defecto como
  @IsString()
  gender: string = 'No especificado'; //valor por defecto

  @IsString()
  role: string = 'user';

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  preferences?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  travelHistory?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  favorites?: string[];
}
