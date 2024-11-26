// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Message } from './entities/chat.entity';

// @Injectable()
// export class ChatService {
//   constructor(
//     @InjectRepository(Message)
//     private readonly messageRepository: Repository<Message>,
//   ) {}

//   async saveMessage(senderId: string, content: string): Promise<Message> {
//     const message = this.messageRepository.create({ senderId, content });
//     return this.messageRepository.save(message);
//   }

//   async getMessages(): Promise<Message[]> {
//     return this.messageRepository.find({ order: { timestamp: 'ASC' } });
//   }
// }

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../chat/entities/message.entity';
import { Room } from '../chat/entities/room.entity';
import { CreateMessageDto } from '../chat/dto/create.message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
  ) {}

  //este cumple 2 funciones. crear el chat si no existe entre 2 users o devolver el chat existente entre 2 users
  async createRoom(roomName: string): Promise<Room> {
    console.log(roomName);
    let room = await this.roomRepository.findOne({ where: { name: roomName } });
    console.log(room);
    if (!room) {
      room = this.roomRepository.create({ name: roomName });
      console.log(room);
      await this.roomRepository.save(room);
    }
    return room;
  }

  async saveMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    const room = await this.roomRepository.findOne({
      where: { id: createMessageDto.roomId },
    });
    const message = this.messageRepository.create({
      ...createMessageDto,
      room,
    });
    return await this.messageRepository.save(message);
  }

  async getMessagesByRoom(roomId: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: { room: { id: roomId } },
      relations: ['room'],
      order: { createdAt: 'ASC' },
    });
  }
}
