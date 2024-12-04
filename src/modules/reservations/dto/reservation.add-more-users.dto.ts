import { ApiProperty } from "@nestjs/swagger";
import {
    IsArray,
    IsNotEmpty,
    IsUUID,
    ArrayNotEmpty
} from "class-validator";


export class ReservationAddUsersDto {
    @ApiProperty({
        description: 'IDs of new users added.',
        example: ['987f6543-e21d-45c9-a123-426614174000', '876e5432-d10c-32a8-c321-326614174000'],
        type: 'array',
        items: { type: 'string', format: 'uuid' }
    })
    @IsArray()
    @ArrayNotEmpty({ message: 'Array with user IDs must have at least one valid UUID.' })
    @IsUUID('4', {
        each: true,
        message: 'User Id must be a valid UUID.',
    })
    userIds: string[]
}