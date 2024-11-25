import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class ForgotPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'El campo email es obligatorio' })
  @IsEmail(
    {},
    {
      message: 'El email debe ser un correo válido.',
    },
  )
  @MaxLength(70, {
    message: 'El número máximo de caracteres se ha sido excedido.',
  })
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message:
      'El correo debe tener un formato válido (sin espacios y con un dominio correcto).',
  })
  email: string;
}
