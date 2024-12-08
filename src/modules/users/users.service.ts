/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { SendGridService } from 'src/shared/mail/sendgrid/sendgrid.service';
import dotEnvOptions from 'src/config/dotenv.config';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly sendGridService: SendGridService,
  ) {}

  async loadTemplateWithCode(): Promise<string> {
    const templatePath = path.resolve(
      __dirname,
      '../../shared/utils/registerTemplate.html',
    );
    console.log('Ruta de la plantilla:', templatePath); // Verifica si la ruta es correcta
    try {
      const template = await fs.promises.readFile(templatePath, 'utf8');
      console.log('Plantilla cargada correctamente');
      return template;
    } catch (error) {
      console.error('Error al cargar la plantilla:', error); // Muestra el error si no se puede cargar la plantilla
      throw new HttpException(
        'Error al cargar la plantilla',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
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
      const savedUser = await this.userRepository.save(user);

      // Cargar y verificar la plantilla
      const template = await this.loadTemplateWithCode();
      console.log('Plantilla cargada:', template);

      // Reemplazar variables dinámicas en la plantilla (si es necesario)
      const personalizedTemplate = template; // Si tienes placeholders para reemplazar, hazlo aquí

      console.log('Enviando correo con plantilla personalizada...');
      const subject = '¡Bienvenido a nuestra plataforma!';
      await this.sendGridService.sendEmail(
        savedUser.email,
        subject,
        'Gracias por registrarte en nuestra plataforma.',
        personalizedTemplate,
      );
      console.log('Correo enviado correctamente');

      return savedUser;
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al crear el usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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

      const { image: _, ...updateData } = updateUserDto;

      const updatedUser = this.userRepository.merge(user, updateData);

      return await this.userRepository.save(updatedUser);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Error al actualizar el usuario con ID ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Error al obtener el usuario con ID ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al obtener los usuarios',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllUsersForPublications(): Promise<User[]> {
    try {
      return await this.userRepository.find({
        select: ['id', 'name', 'image'],
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al obtener los usuarios',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async softDeleteUser(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }
      user.isDeleted = true;
      return await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Error al eliminar suavemente el usuario con ID ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async restoreUser(id: string): Promise<User> {
    try {
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
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Error al restaurar el usuario con ID ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
