// src/chat/dto/create-chat.dto.ts
import { IsArray, IsUUID } from 'class-validator';

export class CreateChatDto {
  @IsArray()
  @IsUUID('all', { each: true })
  users: string[];
}
