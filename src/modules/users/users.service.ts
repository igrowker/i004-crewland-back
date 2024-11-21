import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const existingEmail = await this.userRepository.findOne({
        where: [{ email: createUserDto.email }],
      });

      if (existingEmail) {
        throw new ConflictException('Email en uso ');
      }

      const existingUser = await this.userRepository.findOne({
        where: [{ username: createUserDto.username }],
      });

      console.log(existingUser);

      if (existingUser) {
        throw new ConflictException('Usuario en uso ');
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      return await this.userRepository.save(user);
    } catch (error) {
      throw new Error('Error while creating the user: ' + error.message);
    }
  }

  async findAll() {
    return await this.userRepository.find();
  }
}
