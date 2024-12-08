/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { Logger } from '@nestjs/common';
import { JoinRoomDto } from './dto/join.room.dto'; // Nuevo DTO para validar datos

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name); // Usar logger

  constructor(private readonly chatService: ChatService) {}

  // Método para unirse a una sala basado en nombres de usuarios
  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody() data: JoinRoomDto, // Validar con un DTO
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // Creamos o recuperamos la sala utilizando nombres
      const room = await this.chatService.createRoomForUsers(
        data.userId1,
        data.userId2,
      );

      // El usuario se une a la sala
      client.join(room.id);

      // Emitimos que el usuario se ha unido a la sala
      client.emit('joinedRoom', {
        roomId: room.id,
        roomName: room.name,
        usersInfo: room.users.map((user) => ({
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          image: user.image,
        })), // Solo enviamos datos relevantes de los usuarios
        messages: room?.messages?.map((message) => ({
          id: message.id,
          senderId: message.senderId,
          content: message.content,
          createdAt: message.createdAt,
        })),
      });

      this.logger.log(
        `Usuario ${data.userId1} se ha unido a la sala ${room.name} con ${data.userId2}`,
      );
    } catch (error) {
      this.logger.error(`Error al unirse a la sala: ${error.message}`);
      client.emit('error', { message: 'Error al unirse a la sala' });
    }
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(@MessageBody() data: CreateMessageDto) {
    try {
      this.logger.log('GATEWAY SEND MESSAGE', data);

      // Guardamos el mensaje
      const message = await this.chatService.saveMessage(data);

      // Enviamos el mensaje a todos los clientes en la sala
      this.server.to(message.room.id).emit('receiveMessage', message);

      return message;
    } catch (error) {
      this.logger.error(`Error al enviar mensaje: ${error.message}`);
      throw error;
    }
  }
}