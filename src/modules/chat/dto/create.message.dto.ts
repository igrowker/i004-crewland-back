import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty({
    message: 'El nombre del usuario que envía el mensaje es requerido',
  })
  senderId: string;

  @IsString()
  @IsNotEmpty({ message: 'El mensaje no puede ser vacío' })
  content: string;

  @IsString()
  @IsNotEmpty({ message: 'El ID de la sala de chat es requerido' })
  roomId: string;
}
