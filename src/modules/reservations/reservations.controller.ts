import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationAddUserDto } from './dto/reservation.add-user.dto';
import { ReservationAddUsersDto } from './dto/reservation.add-more-users.dto';
import { ReservationRemoveUserDto } from './dto/reservation.remove-user.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth/jwt-auth.guard';
import { ReservationUpdateTypeDto } from './dto/reservation.update-type.dto';

@Controller('reservations')
@UseGuards(JwtAuthGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) { }

  @Post()
  @ApiBody({
    description: 'Crea una reserva nueva.',
    type: CreateReservationDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Reserva creada correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Solicitud no realizada.',
  })
  async createReservation(
    @Body() createReservationDto: CreateReservationDto
  ) {
    return await this.reservationsService.create(createReservationDto);
  }

  // @Get()
  // findAll() {
  //   return this.reservationsService.findAll();
  // }

  @Get(':reservationId')
  @ApiParam({
    name: 'reservationId',
    description: 'UUID de la reserva.',
  })
  @ApiResponse({
    status: 200,
    description: 'Reserva encontrada.'
  })
  @ApiResponse({
    status: 404,
    description: 'Reserva no encontrada.',
  })
  async findOne(
    @Param('reservationId') reservationId: string
  ) {
    return await this.reservationsService.getById(reservationId)
  }

  @Patch(':reservationId/type')
  @ApiParam({
    name: 'reservationId',
    description: 'ID de la reserva que se va a actualizar.',
    type: 'string',
    format: 'uuid',
  })
  @ApiBody({
    description: 'Actualiza el tipo de la reserva.',
    type: ReservationUpdateTypeDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de reserva actualizado correctamente.'
  })
  @ApiResponse({
    status: 404,
    description: 'Reserva no encontrada.'
  })
  async updateReservationType(
    @Param('reservationId') reservationId: string,
    @Body() updateTypeDto: ReservationUpdateTypeDto,
  ) {
    return await this.reservationsService.updateType(reservationId, updateTypeDto);
  }

  @Delete(':reservationId')
  @ApiParam({
    name: 'reservationId',
    description: 'ID de la reserva que se va a borrar',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Reserva borrada correctamente'
  })
  @ApiResponse({
    status: 404,
    description: 'Reserva no encontrada'
  })
  async remove(
    @Param('reservationId') reservationId: string
  ) {
    await this.reservationsService.remove(reservationId)
    return { message: 'La reserva ha sido eliminada.' };
  }

  @Post(':reservationId/add-user')
  @ApiParam({
    name: 'reservationId',
    description: 'ID de la reserva'
  })
  @ApiBody({
    description: 'Añade un usuario a una reserva',
    type: ReservationAddUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario añadido a la reserva correctamente'
  })
  @ApiResponse({
    status: 404,
    description: 'Reserva no encontrada'
  })
  @ApiResponse({
    status: 400,
    description: 'El usuario ya pertenece a esta reserva'
  })
  async addUserToReservation(
    @Param('reservationId') reservationId: string,
    @Body() addUserDto: ReservationAddUserDto
  ) {
    return await this.reservationsService.addUserToReservation(reservationId, addUserDto)
  }

  @Post(':reservationId/add-users')
  @ApiParam({
    name: 'reservationId',
    description: 'ID de la reserva'
  })
  @ApiBody({
    description: 'Añade múltiples usuarios a una reserva',
    type: ReservationAddUsersDto
  })
  @ApiResponse({
    status: 200,
    description: 'Usuarios añadidos a la reserva correctamente.',
    schema: {
      example: {
        message: 'Usuarios añadidos correctamente',
        addedUsers: ['123e4567-e89b-12d3-a456-426614174000'],
        existingUsers: ['456e7890-a12b-34c5-a678-987654321000'],
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Reserva no encontrada.',
  })
  @ApiResponse({
    status: 400,
    description: 'Todos los usuarios ya pertenecen a esta reserva.',
  })
  async addUsersToReservation(
    @Param('reservationId') reservationId: string,
    @Body() addUsersDto: ReservationAddUsersDto
  ) {
    return await this.reservationsService.addUsersToReservation(reservationId, addUsersDto)
  }

  @Delete(':reservationId/remove-user')
  @ApiParam({ name: 'reservationId', description: 'ID de la reserva' })
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    description: 'Elimina un usuario de una reserva.',
    type: ReservationRemoveUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario eliminado de la reserva correctamente.'
  })
  @ApiResponse({
    status: 404,
    description: 'Reserva no encontrada.'
  })
  @ApiResponse({
    status: 400,
    description: 'El usuario no pertenece a esta reserva.'
  })
  async removeUserFromReservation(
    @Param('reservationId') reservationId: string,
    @Body() removeUserDto: ReservationRemoveUserDto
  ) {
    return await this.reservationsService.removeUserFromReservation(reservationId, removeUserDto)
  }

}
