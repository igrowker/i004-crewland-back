import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import {
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Obtener todas las salas de un usuario
  @Get('rooms/:userId')
  @ApiOperation({ summary: 'Obtener las salas de chat de un usuario' })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario para recuperar sus salas de chat',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de salas de chat del usuario',
    schema: {
      example: [
        { roomId: '1', participants: ['user1', 'user2'] },
        { roomId: '2', participants: ['user1', 'user3'] },
      ],
    },
  })
  async getRooms(@Param('userId') userId: string) {
    return this.chatService.getRoomsByUser(userId);
  }

  // Crear o recuperar una sala para dos usuarios
  @Post('rooms')
  @ApiOperation({
    summary: 'Crear o recuperar una sala de chat para dos usuarios',
  })
  @ApiBody({
    description: 'IDs de los usuarios que participarán en la sala',
    schema: {
      example: {
        userId1: '123e4567-e89b-12d3-a456-426614174000',
        userId2: '123e4567-e89b-12d3-a456-426614174001',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Sala creada o recuperada exitosamente',
    schema: {
      example: {
        roomId: '1',
        participants: ['userId1', 'userId2'],
      },
    },
  })
  async createRoom(
    @Body('userId1') userId1: string,
    @Body('userId2') userId2: string,
  ) {
    return this.chatService.createRoomForUsers(userId1, userId2);
  }

  // Enviar un mensaje en una sala de chat
  @Post('rooms/:roomId/messages')
  @ApiOperation({ summary: 'Enviar un mensaje a una sala de chat' })
  @ApiParam({
    name: 'roomId',
    description: 'ID de la sala de chat donde se enviará el mensaje',
    example: '1',
  })
  @ApiBody({
    description: 'Detalles del mensaje a enviar',
    schema: {
      example: {
        senderId: '123e4567-e89b-12d3-a456-426614174000',
        content: 'Hola, ¿cómo estás?',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Mensaje enviado exitosamente',
    schema: {
      example: {
        id: '456',
        roomId: '1',
        senderId: '123e4567-e89b-12d3-a456-426614174000',
        content: 'Hola, ¿cómo estás?',
        timestamp: '2024-12-08T18:00:00Z',
      },
    },
  })
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
  @Get('rooms/:roomId/messages')
  @ApiOperation({ summary: 'Obtener los mensajes de una sala de chat' })
  @ApiParam({
    name: 'roomId',
    description: 'ID de la sala de chat para recuperar sus mensajes',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de mensajes en la sala de chat',
    schema: {
      example: [
        {
          id: '456',
          senderId: '123e4567-e89b-12d3-a456-426614174000',
          content: 'Hola, ¿cómo estás?',
          timestamp: '2024-12-08T18:00:00Z',
        },
        {
          id: '457',
          senderId: '123e4567-e89b-12d3-a456-426614174001',
          content: 'Todo bien, ¿y tú?',
          timestamp: '2024-12-08T18:05:00Z',
        },
      ],
    },
  })
  async getMessages(@Param('roomId') roomId: string) {
    return this.chatService.getMessagesByRoom(roomId);
  }
}
