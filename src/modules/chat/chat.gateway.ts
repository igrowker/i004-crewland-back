// import {
//   WebSocketGateway,
//   WebSocketServer,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
//   SubscribeMessage,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';

// @WebSocketGateway({ cors: true })
// export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer()
//   server: Server;

//   private messages: string[] = [
//     'Hola, ¿cómo estás?',
//     '¿Qué tal, todo bien?',
//     '¡Un mensaje aleatorio!',
//     'Recuerda, la vida es corta. Sonríe más.',
//     '¿Tienes alguna pregunta? Estoy aquí para ayudarte.',
//   ];

//   private sendRandomMessage() {
//     const randomMessage =
//       this.messages[Math.floor(Math.random() * this.messages.length)];
//     this.server.to('room_general').emit('receiveMessage', randomMessage);
//     console.log('Random message sent:', randomMessage);
//   }

//   constructor() {
//     setInterval(() => this.sendRandomMessage(), 6000);
//   }

//   async handleConnection(client: Socket) {
//     console.log(`Client connected: ${client.id}`);
//     client.join('room_general');
//   }

//   async handleDisconnect(client: Socket) {
//     console.log(`Client disconnected: ${client.id}`);
//   }

//   @SubscribeMessage('sendMessage')
//   async handleMessage(
//     client: Socket,
//     payload: { senderId: string; message: string },
//   ) {
//     console.log('Message received:', payload);

//     this.server.to('room_general').emit('receiveMessage', payload.message);
//   }
// }

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
