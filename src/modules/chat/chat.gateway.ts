import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketServer,
  WebSocketGateway,
  //   SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
// import { MessageDto } from './dto/message.dto';
// import dotEnvOptions from 'src/config/dotenv.config';

@WebSocketGateway({ cors: true })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {}

  afterInit(server: Server): void {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  //   @SubscribeMessage('sendMessage')
  //   async handleSendMessage(
  //     client: Socket,
  //     payload: { chatId: string; message: MessageDto },
  //   ) {
  //     const updatedChat = await this.chatService.addMessage(
  //       payload.chatId,
  //       payload.message,
  //     );
  //     this.server.emit(`chat-${payload.chatId}`, updatedChat);
  //   }
}
