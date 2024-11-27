// src/chat/chat.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { Message } from './entities/message.entity';
import { Room } from './entities/room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Room])],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
