import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum } from 'class-validator';
import { Type } from 'src/shared/utils/enum';

export class ReservationUpdateTypeDto {
  @ApiProperty({
    description: 'New type associated with the reservation.',
    enum: Type,
    example: Type.Crew,
  })
  @IsNotEmpty({ message: 'Type of reservation is a required field.' })
  @IsEnum(Type, {
    message: `Type of reservation must be: ${Type.Crew}, ${Type.Accommodation}, ${Type.Transport}.`,
  })
  type: Type;
}
