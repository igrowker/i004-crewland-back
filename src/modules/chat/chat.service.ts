import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/chat.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async saveMessage(senderId: string, content: string): Promise<Message> {
    const message = this.messageRepository.create({ senderId, content });
    return this.messageRepository.save(message);
  }

  async getMessages(): Promise<Message[]> {
    return this.messageRepository.find({ order: { timestamp: 'ASC' } });
  }
}
