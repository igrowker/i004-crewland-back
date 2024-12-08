// import { ApiProperty } from '@nestjs/swagger';
// import {
//   IsArray,
//   IsEnum,
//   IsNotEmpty,
//   IsNumber,
//   IsOptional,
//   IsUUID,
// } from 'class-validator';
// import { Type } from 'src/shared/utils/enum';

// export class UpdateReservationDto {
//   @ApiProperty({
//     description: 'Reserve type (crew/accommodation/transport)',
//     enum: Type,
//   })
//   @IsNotEmpty({ message: 'Type is a required field' })
//   @IsEnum(Type, { message: 'Type must be crew, accommodation or transport.' })
//   type: Type;

//   @ApiProperty({
//     description: 'Post ID',
//     type: 'string',
//     format: 'uuid',
//   })
//   @IsNotEmpty({ message: 'Post ID is a required field' })
//   @IsUUID('4', { message: 'Post ID must be a valid UUID' })
//   postId: string;

//   @ApiProperty({
//     description: 'Array of user IDs that initiate the reservation.',
//     type: [String],
//     required: false,
//   })
//   @IsArray()
//   @IsUUID('4', {
//     each: true,
//     message: 'Each user ID must be a valid UUID.',
//   })
//   @IsOptional()
//   userIds: string[];

//   @ApiProperty({
//     description: 'Number of people in the reservation',
//     type: 'number',
//   })
//   @IsNotEmpty({ message: 'People amount is a required field' })
//   @IsNumber({}, { message: 'People amount must be a number' })
//   peopleAmount: number;
// }
