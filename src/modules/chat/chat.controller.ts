import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create.message.dto';
import { JoinRoomDto } from './dto/join.room.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

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
