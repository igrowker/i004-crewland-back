import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
  ) {}

  async createChat(users: string[]): Promise<Chat> {
    const newChat = this.chatRepository.create({
      users,
      messages: [],
    });
    return this.chatRepository.save(newChat);
  }
}
