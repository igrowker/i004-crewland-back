import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/chat.entity';
import { Room } from './entities/room.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  // Crear o buscar una sala por nombre
  async getOrCreateRoom(roomName: string): Promise<Room> {
    let room = await this.roomRepository.findOne({ where: { name: roomName } });
    if (!room) {
      room = this.roomRepository.create({ name: roomName });
      await this.roomRepository.save(room);
    }
    return room;
  }

  // Guardar un mensaje en una sala
  async saveMessage(
    senderId: string,
    content: string,
    roomName: string,
  ): Promise<Message> {
    const room = await this.getOrCreateRoom(roomName);
    const message = this.messageRepository.create({
      senderId,
      content,
      room,
    });
    return await this.messageRepository.save(message);
  }

  // Obtener mensajes de una sala
  async getMessages(roomName: string): Promise<Message[]> {
    const room = await this.roomRepository.findOne({
      where: { name: roomName },
      relations: ['messages'],
    });
    if (!room) return [];
    return room.messages;
  }
}
