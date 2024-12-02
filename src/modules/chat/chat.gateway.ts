import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  private connectedUsers = new Map<string, string>();

  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.connectedUsers.set(client.id, userId);
      console.log(`User connected: ${userId}`);
    } else {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = this.connectedUsers.get(client.id);
    if (userId) {
      this.connectedUsers.delete(client.id);
      console.log(`User disconnected: ${userId}`);
    }
  }

  // Manejar mensajes en la sala general
  @SubscribeMessage('sendGeneralMessage')
  async handleGeneralMessage(
    client: Socket,
    payload: { senderId: string; message: string },
  ) {
    const roomName = 'general';
    const savedMessage = await this.chatService.saveMessage(
      payload.senderId,
      payload.message,
      roomName,
    );

    this.server.to(roomName).emit('receiveGeneralMessage', savedMessage);
  }

  // Unirse a una sala privada
  @SubscribeMessage('joinPrivateChat')
  async joinPrivateChat(
    client: Socket,
    payload: { userId: string; recipientId: string },
  ) {
    const roomName = this.getRoomName(payload.userId, payload.recipientId);
    client.join(roomName);
    console.log(
      `${payload.userId} joined private chat with ${payload.recipientId}`,
    );
  }

  // Manejar mensajes en un chat privado
  @SubscribeMessage('sendPrivateMessage')
  async handlePrivateMessage(
    client: Socket,
    payload: { senderId: string; recipientId: string; message: string },
  ) {
    const roomName = this.getRoomName(payload.senderId, payload.recipientId);
    const savedMessage = await this.chatService.saveMessage(
      payload.senderId,
      payload.message,
      roomName,
    );

    this.server.to(roomName).emit('receivePrivateMessage', savedMessage);
  }

  // Generar un nombre único para la sala privada
  private getRoomName(userId: string, recipientId: string): string {
    return [userId, recipientId].sort().join('_'); // Nombre consistente para la sala
  }
}
