import {
  Controller,
  Post,
  Patch,
  Body,
  // UseGuards,
  Param,
  Get,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { UserOwnershipGuard } from 'src/shared/guards/user-ownership-guard/user-ownership-guard.guard';
import { User } from './entities/user.entity';
import { Roles } from 'src/shared/decorators/role.decorator';
import { Role } from 'src/shared/utils/enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth/jwt-auth.guard';
import { RoleGuard } from 'src/shared/guards/roles/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Crear un nuevo usuario',
    description: 'Permite registrar un nuevo usuario con datos válidos.',
  })
  @ApiResponse({
    status: 201,
    description: 'El usuario ha sido creado exitosamente.',
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Los datos proporcionados no son válidos.',
  })
  @ApiBody({
    description: 'Datos del usuario a crear',
    type: CreateUserDto,
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard, UserOwnershipGuard)
  @Roles(Role.Admin, Role.User)
  @ApiOperation({
    summary: 'Actualizar parcialmente la información de un usuario',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario a actualizar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    description: 'Datos a actualizar del usuario',
    type: UpdateUserDto,
    examples: {
      example1: {
        value: {
          name: 'Juan Perez',
          username: 'juan.perez',
          email: 'juan.perez@example.com',
          password: 'MyNewStrongP@ssw0rd',
          role: 'User',
          age: '2000-01-01',
          gender: 'no especifica',
          preferences: ['Jugar al futbol', 'Escuchar música'],
          travelHistory: ['España', 'México'],
          favorites: ['Jugar al futbol', 'Escuchar música'],
          tel: '+1 (555) 123-4567',
        },
        description:
          'Ejemplo de actualización de usuario con todos los campos.',
      },
      example2: {
        value: {
          email: 'nuevo.correo@example.com',
        },
        description: 'Ejemplo de actualización de solo el correo electrónico.',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'El usuario ha sido actualizado exitosamente.',
    type: UpdateUserDto,
    examples: {
      example1: {
        value: {
          name: 'Juan Perez',
          username: 'juanp',
          email: 'juan.perez@example.com',
          password: 'MyNewStrongP@ssw0rd',
          role: 'User',
          age: '2000-01-01',
          gender: 'no especifica',
          preferences: ['Jugar al futbol', 'Escuchar música'],
          travelHistory: ['España', 'México'],
          favorites: ['Jugar al futbol', 'Escuchar música'],
          tel: '+1 (555) 123-4567',
        },
        summary: 'Datos actualizados del usuario.',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Los datos proporcionados no son válidos.',
    type: UpdateUserDto,
    examples: {
      example1: {
        value: {
          name: 'Juan',
          username: 'juanp',
          email: 'nuevo.correo@example.com',
          password: 'MyNewStrongP@ssw0rd',
          role: 'User',
          age: '2000-01-01',
          gender: 'no especifica',
          preferences: ['Jugar al futbol', 'Escuchar música'],
          travelHistory: ['España', 'México'],
          favorites: ['Jugar al futbol', 'Escuchar música'],
          tel: '+1 (555) 123-4567',
          id: '123e4567-e89b-12d3-a456-426614174000',
        },
        summary: 'Datos actualizados del usuario.',
      },
    },
  })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener un usuario por ID',
    description: 'Permite obtener información detallada de un usuario.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario a buscar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles del usuario.',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado.',
  })
  async getUserById(@Param('id') id: string): Promise<User> {
    return await this.usersService.getUserById(id);
  }

  @Get()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener todos los usuarios (Solo Admin)',
    description: 'Devuelve una lista de todos los usuarios registrados.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios recuperada exitosamente.',
  })
  async getUsers() {
    return this.usersService.getUsers();
  }

  // agregar campo para eliminar usuarios
}
