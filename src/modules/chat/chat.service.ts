/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid'; // Para generar UUIDs
import { Message } from './entities/message.entity';
import { Room } from './entities/room.entity';
import { CreateMessageDto } from './dto/create.message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async createRoomForUsers(userId1: string, userId2: string): Promise<Room> {
    const roomId = uuidv4(); // Generar un UUID único para la sala
    const roomName = `room_${userId1}_${userId2}`; // Usamos un nombre descriptivo para la sala
  
    // Verificamos si ya existe una sala con este ID
    let room = await this.roomRepository.findOne({ where: { name: roomName } });
  
    // Si no existe, la creamos
    if (!room) {
      room = this.roomRepository.create({ id: roomId, name: roomName });
      await this.roomRepository.save(room);
    }
  
    return room; // Retornamos la sala con el UUID
  }
  

  // Guardar el mensaje en la base de datos
  async saveMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    const room = await this.roomRepository.findOne({
      where: { id: createMessageDto.roomId },
    });

    // Creamos y guardamos el mensaje
    const message = this.messageRepository.create({
      ...createMessageDto,
      room,
    });

    return await this.messageRepository.save(message);
  }

  // Obtener los mensajes de una sala
  async getMessagesByRoom(roomId: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: { room: { id: roomId } },
      relations: ['room'],
      order: { createdAt: 'ASC' },
    });
  }
}
