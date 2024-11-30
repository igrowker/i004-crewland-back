import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create.message.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  // Método para unirse a una sala
  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody() data: { userId1: string; userId2: string },
    @ConnectedSocket() client: Socket,
  ) {
    // Creamos o recuperamos la sala
    const room = await this.chatService.createRoomForUsers(
      data.userId1,
      data.userId2,
    );

    // El usuario se une a la sala
    client.join(room.id); // el user usa el roomId q tiene q ser un uuid para unir al usuario

    // emit --> Emitimos que el user se ha unido a la sala, no olvidar incluir el el roomId
    client.emit('joinedRoom', {
      roomId: room.id,
      roomName: room.name,
    });

    console.log(`Usuario ${data.userId1} se ha unido a la sala ${room.name}`);
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(@MessageBody() data: CreateMessageDto) {
    console.log('GATE WAY SEND MESSAGE', data);
    const message = await this.chatService.saveMessage(data); // Guardamos el mensaje
    this.server.to(message.room.id).emit('receiveMessage', message); //con esto mandamos el mensjae a todos los de la sala
    return message;
  }
}
