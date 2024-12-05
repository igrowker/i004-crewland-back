/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsUUID,
} from 'class-validator';
import { Type } from 'src/shared/utils/enum';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateReservationDto {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'Reserve type (crew/accommodation/transport)',
        enum: Type,
    })
    @IsNotEmpty({ message: 'Type is a required field' })
    @IsEnum(Type, { message: 'Type must be crew, accommodation or transport.' })
    type: Type;

    @IsNotEmpty()
    @IsNumber()
    peopleAmount: number;

    @ApiProperty({
        description: 'Post ID',
        type: 'string',
        format: 'uuid',
    })
    @IsNotEmpty({ message: 'Post ID is a required field' })
    @IsUUID('4', { message: 'Post ID must be a valid UUID' })
    postId: string;

    @ApiProperty({
        description: 'Array of user IDs that initiate the reservation.',
        type: [String],
        required: false,
    })
    @IsArray()
    @IsUUID('4', {
        each: true,
        message: 'Each user ID must be a valid UUID.',
    })
    @IsOptional()
    userIds?: string[];
}
