import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Message } from './entities/message.entity';
import { Room } from './entities/room.entity';
import { User } from '../users/entities/user.entity';
import { CreateMessageDto } from './dto/create.message.dto';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Método para obtener todas las salas asociadas a un usuario
  async getRoomsByUser(userId: string): Promise<Room[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['rooms'], // Cargar las salas relacionadas con el usuario
    });

    if (!user) {
      this.logger.warn(`Usuario con id ${userId} no encontrado`);
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    this.logger.log(`Recuperando las salas asociadas al usuario ${userId}`);
    return user.rooms;
  }

  // Crear o recuperar una sala para dos usuarios
  async createRoomForUsers(userId1: string, userId2: string): Promise<Room> {
    if (!userId1 || !userId2) {
      throw new Error('Ambos usuarios son requeridos para crear una sala');
    }

    const roomName = `room_${userId1}_${userId2}`;
    this.logger.log(`Intentando crear o recuperar la sala: ${roomName}`);

    let room = await this.roomRepository.findOne({ where: { name: roomName } });

    if (!room) {
      room = this.roomRepository.create({
        id: uuidv4(),
        name: roomName,
      });

      try {
        await this.roomRepository.save(room);
        this.logger.log(`Sala creada con éxito: ${roomName}`);
      } catch (error) {
        this.logger.error(`Error al guardar la sala: ${error.message}`);
        throw new Error('Error al guardar la sala en la base de datos');
      }
    } else {
      this.logger.log(`Sala ya existente: ${roomName}`);
    }

    return room;
  }

  // Guardar un mensaje en la base de datos con transacciones
  async saveMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    return await this.dataSource.transaction(async (manager) => {
      const room = await manager.findOne(Room, {
        where: { id: createMessageDto.roomId },
      });

      if (!room) {
        throw new NotFoundException(
          `Room with id ${createMessageDto.roomId} not found`,
        );
      }

      const message = manager.create(Message, {
        ...createMessageDto,
        room,
      });

      this.logger.log(
        `Guardando mensaje en la sala ${room.name} por el usuario ${createMessageDto.senderId}`,
      );

      return manager.save(message);
    });
  }

  // Obtener los mensajes de una sala
  async getMessagesByRoom(roomId: string): Promise<Message[]> {
    // Verificar que la sala exista
    await this.findRoomById(roomId);

    const messages = await this.messageRepository.find({
      where: { room: { id: roomId } },
      select: ['id', 'content', 'createdAt', 'senderId'],
      order: { createdAt: 'ASC' },
    });

    this.logger.log(`Mensajes recuperados para la sala ${roomId}`);
    return messages;
  }

  // Método privado para buscar una sala por ID
  private async findRoomById(roomId: string): Promise<Room> {
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      this.logger.warn(`Sala con id ${roomId} no encontrada`);
      throw new NotFoundException(`Room with id ${roomId} not found`);
    }
    return room;
  }
}
