/* eslint-disable prettier/prettier */
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUsers(){
    return await this.userRepository.find();
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
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

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingEmail = await this.userRepository.findOne({
          where: { email: updateUserDto.email },
        });
        if (existingEmail) {
          throw new ConflictException('Email en uso');
        }
      }

      if (updateUserDto.username && updateUserDto.username !== user.username) {
        const existingUsername = await this.userRepository.findOne({
          where: { username: updateUserDto.username },
        });
        if (existingUsername) {
          throw new ConflictException('Usuario en uso');
        }
      }

      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      const updatedUser = this.userRepository.merge(user, updateUserDto);

      return await this.userRepository.save(updatedUser);
    } catch (error) {
      throw new Error('Error while updating the user: ' + error.message);
    }
  }
}
