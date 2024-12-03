import {
  Controller,
  Post,
  Patch,
  Body,
  Param,
  Get,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserOwnershipGuard } from 'src/shared/guards/user-ownership-guard/user-ownership-guard.guard';
import { User } from './entities/user.entity';
import { Roles } from 'src/shared/decorators/role.decorator';
import { Role } from 'src/shared/utils/enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth/jwt-auth.guard';
import { RoleGuard } from 'src/shared/guards/roles/roles.guard';

@ApiTags('Users')
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
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update user information' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    description: 'User data to update',
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
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.usersService.updateUser(id, updateUserDto, image);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
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
  @ApiResponse({
    status: 403,
    description: 'No tienes permisos para realizar esta acción.',
  })
  async getUsers() {
    return this.usersService.getUsers();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Soft Delete a user (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'User ID to soft delete',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  async softDeleteUser(@Param('id') id: string) {
    return this.usersService.softDeleteUser(id);
  }

  @Patch(':id/restore')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Restore a soft-deleted user (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'User ID to restore',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  async restoreUser(@Param('id') id: string) {
    return this.usersService.restoreUser(id);
  }
}
