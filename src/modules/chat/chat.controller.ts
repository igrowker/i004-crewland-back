import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Obtener todas las salas de un usuario
  @Get('rooms/:userId')
  async getRooms(@Param('userId') userId: string) {
    return this.chatService.getRoomsByUser(userId);
  }

  // Crear o recuperar una sala para dos usuarios
  @Post('rooms')
  async createRoom(
    @Body('userId1') userId1: string,
    @Body('userId2') userId2: string,
  ) {
    return this.chatService.createRoomForUsers(userId1, userId2);
  }

  @Post('rooms/:roomId/messages')
  async sendMessage(
    @Param('roomId') roomId: string,
    @Body('senderId') senderId: string,
    @Body('content') content: string,
  ) {
    // Llama al servicio para guardar el mensaje
    return this.chatService.saveMessage({
      roomId,
      senderId,
      content,
    });
  }

  // Obtener todos los mensajes de una sala
  @Get('rooms/:roomId/messages/algo')
  async getMessages(@Param('roomId') roomId: string) {
    return this.chatService.getMessagesByRoom(roomId);
  }
}
