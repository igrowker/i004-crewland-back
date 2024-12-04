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
    return this.reservationsService.findOne(id);
  }

  @Post(':id/add-user')
  @ApiOperation({ summary: 'Add a new user to the reservation.' })
  @ApiParam({
    name: 'id',
    description: 'ID of the reservation.',

  })
  @ApiBody({
    description: 'Add a new user to the reservation.',
    type: ReservationAddUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'User added succesfully.'
  })
  @ApiResponse({
    status: 404,
    description: 'Reservation not found.'
  })
  @ApiResponse({
    status: 400,
    description: 'User already belongs to the reservation.'
  })
  async addUserToReservation(
    @Param('id') id: string,
    @Body() addUserDto: ReservationAddUserDto
  ) {
    return await this.reservationsService.addUserToReservation(id, addUserDto)
  }

  @Post(':id/add-users')
  @ApiOperation({ summary: 'Add an array of new users to the reservation.' })
  @ApiParam({
    name: 'id',
    description: 'ID of the reservation.'
  })
  @ApiBody({
    description: 'Add new users to the reservation.',
    type: ReservationAddUsersDto
  })
  @ApiResponse({
    status: 200,
    description: 'Users added succesfully.',
    schema: {
      example: {
        message: 'Users added succesfully.',
        addedUsers: ['123e4567-e89b-12d3-a456-426614174000'],
        existingUsers: ['456e7890-a12b-34c5-a678-987654321000'],
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Reservation not found.',
  })
  @ApiResponse({
    status: 400,
    description: 'All users already belong to the reservation.',
  })
  async addUsersToReservation(
    @Param('id') id: string,
    @Body() addUsersDto: ReservationAddUsersDto
  ) {
    return await this.reservationsService.addUsersToReservation(id, addUsersDto)
  }

  // @Patch(':id')
  // @ApiOperation({ summary: 'Update a reservation by ID' })
  // @ApiParam({
  //   name: 'id',
  //   description: 'ID of the reservation to update',
  //   type: 'string',
  // })
  // @ApiBody({
  //   description: 'Data to update the reservation',
  //   type: UpdateReservationDto,
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Reservation updated successfully.',
  // })
  // @ApiResponse({ status: 404, description: 'Reservation not found.' })
  // update(
  //   @Param('id') id: string,
  //   @Body() updateReservationDto: UpdateReservationDto,
  // ) {
  //   return await this.reservationsService.update(id, updateReservationDto)
  // }

  @Patch(':id/type')
  @ApiOperation({ summary: 'Update a reservation type by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the reservation to update',
    type: 'string',
    format: 'uuid',
  })
  @ApiBody({
    description: 'Data to update the reservation',
    type: ReservationUpdateTypeDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Reservation type updated successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Reservation not found.'
  })
  async updateReservationType(
    @Param('id') id: string,
    @Body() updateTypeDto: ReservationUpdateTypeDto,
  ) {
    return await this.reservationsService.updateType(id, updateTypeDto);
  }

  @Delete(':id/remove-user')
  @ApiOperation({ summary: 'Delete a user from a reservation by ID.' })
  @ApiParam({ name: 'id', description: 'Id of the reservation.' })
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    description: 'Removes a user from the reservation.',
    type: ReservationRemoveUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Removed user from the reservation.'
  })
  @ApiResponse({
    status: 404,
    description: 'Reservation not found.'
  })
  @ApiResponse({
    status: 400,
    description: 'User does not belong to the reservation.'
  })
  async removeUserFromReservation(
    @Param('id') id: string,
    @Body() removeUserDto: ReservationRemoveUserDto
  ) {
    return await this.reservationsService.removeUserFromReservation(id, removeUserDto)
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
    return this.reservationsService.remove(id);
  }

}
