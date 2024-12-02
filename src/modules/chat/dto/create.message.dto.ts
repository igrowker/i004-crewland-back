import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty({ message: 'El id del user que envia el mensaje es requerido' })
  senderId: string;

  @IsString()
  @IsNotEmpty({ message: 'El mensaje no puede ser vacio' })
  content: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre la room de chat es requerido' })
  roomId: string;
}
