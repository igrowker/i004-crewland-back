import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class ReservationAddUserDto {
  @ApiProperty({
    description: 'User ID added to the reservation.',
    example: '987f6543-e21d-45c9-a123-426614174000',
    type: 'string',
    format: 'uuid',
  })
  @IsNotEmpty({ message: 'User ID is a required field.' })
  @IsUUID('4', {
    message: 'User ID must be a valid UUID.',
  })
  userId: string;
}
