import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '../chat/entities/chat.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  // Crear un chat entre usuarios
  async createChat(createChatDto: CreateChatDto): Promise<Chat> {
    const { users } = createChatDto;

    // Buscar entidades de usuarios
    const usuarios = await this.userRepository.findByIds(users);
    if (usuarios.length !== users.length) {
      throw new NotFoundException('One or more users not found');
    }

    let userIds: string[];

    if (Array.isArray(users)) {
      if (typeof users[0] === 'string') {
        // Si 'users' es un array de strings (IDs de usuario)
        userIds = users;
      } else {
        // Si 'users' es un array de objetos con la propiedad 'id'
        userIds = usuarios.map((user) => user.id);
      }
    } else {
      // Manejo de caso inesperado
      throw new Error('Expected users to be an array');
    }
    // Verificar si ya existe un chat entre los mismos usuarios
    const existingChat = await this.chatRepository
      .createQueryBuilder('chat')
      .innerJoinAndSelect('chat.usuarios', 'user')
      .where('user.id IN (:...userIds)', { userIds })
      .groupBy('chat.id')
      .addGroupBy('user.id')
      .having('COUNT(user.id) = :count', { count: users.length })
      .getOne();

    if (existingChat) {
      return existingChat;
    }

    // Crear un nuevo chat con usuarios ya relacionados
    const chat = this.chatRepository.create({ usuarios });
    chat.messages = []; // Inicializar mensajes vacíos
    return this.chatRepository.save(chat); // Guardar el chat
  }

  // Obtener mensajes de los chats de un usuario
  async getMessages(userId: string): Promise<Chat[]> {
    // Buscar chats con el usuario
    const chats = await this.chatRepository.find({
      relations: ['usuarios'],
      where: { usuarios: { id: userId } },
    });
    return chats || [];
  }

  // Enviar un mensaje a un chat
  async SendMessageDto(SendMessageDto: SendMessageDto): Promise<Chat> {
    const { chatId, userId, message } = SendMessageDto;

    // Verificar que el chat exista
    const chats = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['usuarios'],
    });
    if (!chats) {
      throw new NotFoundException('Chat not found');
    }

    // Agregar el mensaje al chat
    chats.messages.push({
      message: message,
      userId: userId,
      date: new Date(),
    });
    return this.chatRepository.save(chats);
  }
}
