// src/chat/dto/send-message.dto.ts
import { IsUUID, IsString } from 'class-validator';

export class SendMessageDto {
  @IsUUID()
  chatId: string;

  @IsUUID()
  userId: string;

  @IsString()
  message: string;
}
