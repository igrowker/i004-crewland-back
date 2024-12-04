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
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationAddUserDto } from './dto/reservation.add-user.dto';
import { ReservationAddUsersDto } from './dto/reservation.add-more-users.dto';
import { ReservationRemoveUserDto } from './dto/reservation.remove-user.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth/jwt-auth.guard';
import { ReservationUpdateTypeDto } from './dto/reservation.update-type.dto';

@ApiTags('Reservations') // Categoría en Swagger
@Controller('reservations')
@UseGuards(JwtAuthGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new reservation' })
  @ApiBody({
    description: 'Data for the new reservation',
    type: CreateReservationDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Reservation created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.create(createReservationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reservations' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of reservations.',
  })
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific reservation by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the reservation to retrieve',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the reservation data.',
  })
  @ApiResponse({ status: 404, description: 'Reservation not found.' })
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a reservation by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the reservation to update',
    type: 'string',
  })
  @ApiBody({
    description: 'Data to update the reservation',
    type: UpdateReservationDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Reservation updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Reservation not found.' })
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
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

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a reservation by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the reservation to delete',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Reservation deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Reservation not found.' })
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(+id);
  }

}
