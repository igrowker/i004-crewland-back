// src/chat/chat.module.ts
// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ChatService } from './chat.service';
// import { ChatGateway } from './chat.gateway';
// import { Message } from './entities/chat.entity';

// @Module({
//   imports: [TypeOrmModule.forFeature([Message])],
//   providers: [ChatGateway, ChatService],
// })
// export class ChatModule {}
import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '../chat/entities/message.entity';
import { Room } from '../chat/entities/room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Room])],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
