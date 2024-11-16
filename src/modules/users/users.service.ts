import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import User from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { name, email, password } = createUserDto;
      const existingUser = await this.userRepository.findOne({
        where: [{ name }],
      });

      if (existingUser) {
        throw new ConflictException(
          'El usuario con este nombre de usuario o correo ya existe',
        );
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = this.userRepository.create({
        name,
        email,
        password: hashedPassword,
        age: parseInt(createUserDto.age.toString()) || 30,
        favorites: createUserDto.favorites,
        gender: createUserDto.gender || 'abc',
        role: createUserDto.role,
        preferences: createUserDto.preferences,
        travelHistory: createUserDto.travelHistory,
      });
      return this.userRepository.save(user);
    } catch (error) {
      throw new Error('Error al crear el usuario: ' + error.message);
    }
  }

  async findAll() {
    return await this.userRepository.find();
  }
}
