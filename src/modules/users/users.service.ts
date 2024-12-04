import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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

  private handleError(error: any, message: string): never {
    console.error(error);
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      console.log('llego peticion front');
      const existingEmail = await this.userRepository.findOne({
        where: [{ email: createUserDto.email }],
      });
      if (existingEmail) {
        throw new HttpException('Email en uso', HttpStatus.CONFLICT);
      }
      const existingUser = await this.userRepository.findOne({
        where: [{ username: createUserDto.username }],
      });
      if (existingUser) {
        throw new HttpException('Usuario en uso', HttpStatus.CONFLICT);
      }
      const existingPhone = await this.userRepository.findOne({
        where: [{ tel: createUserDto.tel }],
      });
      if (existingPhone) {
        throw new HttpException(
          'Número de teléfono en uso',
          HttpStatus.CONFLICT,
        );
      }
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
        image: dotEnvOptions.DEFAULT_IMG_USER_CLOUDINARY,
      });
      return await this.userRepository.save(user);
    } catch (error) {
      this.handleError(error, 'Error al crear el usuario');
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
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }

      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingEmail = await this.userRepository.findOne({
          where: { email: updateUserDto.email },
        });
        if (existingEmail) {
          throw new HttpException('Email en uso', HttpStatus.CONFLICT);
        }
      }

      if (updateUserDto.username && updateUserDto.username !== user.username) {
        const existingUsername = await this.userRepository.findOne({
          where: { username: updateUserDto.username },
        });
        if (existingUsername) {
          throw new HttpException('Usuario en uso', HttpStatus.CONFLICT);
        }
      }
      if (updateUserDto.tel && updateUserDto.tel !== user.tel) {
        const existingTel = await this.userRepository.findOne({
          where: { tel: updateUserDto.tel },
        });
        if (existingTel) {
          throw new HttpException(
            'Numero de telefono en uso',
            HttpStatus.CONFLICT,
          );
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

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { image: _, ...updateData } = updateUserDto;

      const updatedUser = this.userRepository.merge(user, updateData);

      return await this.userRepository.save(updatedUser);
    } catch (error) {
      this.handleError(error, `Error al actualizar el usuario con ID ${id}`);
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }

      return user;
    } catch (error) {
      this.handleError(error, `Error al obtener el usuario con ID ${id}`);
    }
  }

  async getUsers() {
    return await this.userRepository.find({ where: { isDeleted: false } });
  }

  async softDeleteUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    user.isDeleted = true;
    return await this.userRepository.save(user);
  }
  async restoreUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, isDeleted: true },
    });

    if (!user) {
      throw new HttpException(
        'Usuario eliminado no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    user.isDeleted = false;
    return await this.userRepository.save(user);
  }
}
