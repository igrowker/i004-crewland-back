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
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import dotEnvOptions from 'src/config/dotenv.config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const existingEmail = await this.userRepository.findOne({
        where: [{ email: createUserDto.email }],
      });

      if (existingEmail) {
        throw new ConflictException('Email en uso');
      }

      const existingUser = await this.userRepository.findOne({
        where: [{ username: createUserDto.username }],
      });

      if (existingUser) {
        throw new ConflictException('Usuario en uso');
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

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
    image?: Express.Multer.File,
  ): Promise<User> {
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
      if (image) {
        const imageUrl = await this.cloudinaryService.uploadImagesToCloudinary([
          image,
        ]);
        user.image = imageUrl[0];
      } else {
        user.image = dotEnvOptions.DEFAULT_IMG_USER_CLOUDINARY;
      }

      // Crear un objeto con las propiedades actualizadas, excluyendo 'image'
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { image: _, ...updateData } = updateUserDto;

      // Fusionar las actualizaciones con el usuario existente
      const updatedUser = this.userRepository.merge(user, updateData);

      return await this.userRepository.save(updatedUser);
    } catch (error) {
      throw new Error('Error while updating the user: ' + error.message);
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      return user;
    } catch (error) {
      throw new Error('Error while fetching the user: ' + error.message);
    }
  }

  async getUsers() {
    return await this.userRepository.find({ where: { isDeleted: false } });
  }

  async softDeleteUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    user.isDeleted = true;
    return await this.userRepository.save(user);
  }
  async restoreUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, isDeleted: true },
    });

    if (!user) {
      throw new NotFoundException('Usuario eliminado no encontrado');
    }

    user.isDeleted = false;
    return await this.userRepository.save(user);
  }
}
