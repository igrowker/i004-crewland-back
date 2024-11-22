/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Patch,
  Body,
  // UseGuards,
  Param,
  Get,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { Roles } from 'src/shared/decorators/role.decorator';
import { Role } from 'src/shared/utils/enum';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(){
    return this.usersService.getUsers();
  }

  // POST /users
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @ApiBearerAuth()
  @Patch(':id')
  // @UseGuards(JwtAuthGuard, RoleGuard) // Guards para autenticación y autorización
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
          name: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com',
          password: 'MyNewStrongP@ssw0rd',
          cuit: '20-12345678-9',
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
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }
}
