import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  age: number;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsString()
  role: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  preferences?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  travelHistory?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  favorites?: string[];
}
