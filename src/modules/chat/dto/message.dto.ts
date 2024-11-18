import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
export class MessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsDateString()
  date: Date;
}
