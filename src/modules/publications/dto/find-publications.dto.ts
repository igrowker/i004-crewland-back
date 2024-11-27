import { IsOptional, IsString, IsDate, IsEnum, IsNumber } from 'class-validator';
import { Type } from 'src/shared/utils/enum';

export class FindPublicationsDto {
    @IsOptional()
    @IsEnum(Type)
    type?: Type;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsDate()
    fromDate?: Date;

    @IsOptional()
    @IsDate()
    toDate?: Date;

    @IsOptional()
    @IsNumber()
    maxParticipants?: number;
}
