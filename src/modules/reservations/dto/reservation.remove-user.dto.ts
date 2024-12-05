import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class ReservationRemoveUserDto {
  @ApiProperty({
    description: 'User Id removed from the reservation.',
    example: '987f6543-e21d-45c9-a123-426614174000',
    type: 'string',
    format: 'uuid',
  })
  @IsNotEmpty({ message: 'User Id is a required field.' })
  @IsUUID('4', {
    message: 'User Id must be a valid UUID.',
  })
  userId: string;
}
