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
import { JoinRoomDto } from './dto/join.room.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody() data: JoinRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    const room = await this.chatService.createRoom(data.roomName);
    client.join(room.name);
    return { roomId: room.id, roomName: room.name };
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(@MessageBody() data: CreateMessageDto) {
    const message = await this.chatService.saveMessage(data);
    this.server.to(message.room.name).emit('receiveMessage', message);
    return message;
  }
}
