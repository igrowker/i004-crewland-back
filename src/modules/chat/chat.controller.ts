/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Crear o buscar una sala
  @Post('rooms')
  async createRoom(@Body('roomName') roomName: string) {
    // return this.chatService.getOrCreateRoom(roomName);
  }

  // Enviar un mensaje a una sala
  @Post('rooms/:roomName/messages')
  async sendMessage(
    @Param('roomName') roomName: string,
    @Body('senderId') senderId: string,
    @Body('content') content: string,
  ) {
    // return this.chatService.saveMessage(senderId, content, roomName);
  }

  // Obtener todos los mensajes de una sala
  @Get('rooms/:roomName/messages')
  async getMessages(@Param('roomName') roomName: string) {
    // return this.chatService.getMessages(roomName);
  }
}
