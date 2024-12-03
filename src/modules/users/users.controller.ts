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
  @ApiOperation({ summary: 'Register a new user' })
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
  async getUserById(@Param('id') id: string): Promise<User> {
    return await this.usersService.getUserById(id);
  }

  @Get()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ summary: 'Get all users (Admin only)' })
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
