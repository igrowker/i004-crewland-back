import { IsNotEmpty, IsString } from 'class-validator';

export class JoinRoomDto {
  @IsString()
  userId1: string;

  @IsString()
  userId2: string;

  @IsString()
  @IsNotEmpty({ message: 'El id del user es requerido' })
  userId: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre la room de chat es requerido' })
  roomName: string;
}
