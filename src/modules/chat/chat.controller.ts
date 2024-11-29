import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { JoinRoomDto } from './dto/create-chat.dto';
import { CreateMessageDto } from './dto/send-message.dto';
import { ChatService1 } from './chat.service1';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService1) {}

  @Post('rooms')
  async createRoom(@Body() joinRoomDto: JoinRoomDto) {
    return this.chatService.createRoom(joinRoomDto.roomName);
  }

  @Post('messages')
  async sendMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.chatService.saveMessage(createMessageDto);
  }

  @Get('rooms/:roomId/messages')
  async getMessagesByRoom(@Param('roomId') roomId: string) {
    return this.chatService.getMessagesByRoom(roomId);
  }
}
