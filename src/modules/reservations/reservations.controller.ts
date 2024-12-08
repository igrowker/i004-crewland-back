// import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
// import {
//   ApiTags,
//   ApiOperation,
//   ApiParam,
//   ApiBody,
//   ApiResponse,
// } from '@nestjs/swagger';
// import { ReservationsService } from './reservations.service';
// import { CreateReservationDto } from './dto/create-reservation.dto';
// import { JwtAuthGuard } from 'src/shared/guards/jwt-auth/jwt-auth.guard';

// @ApiTags('Reservations') // Categoría en Swagger
// @Controller('reservations')
// @UseGuards(JwtAuthGuard)
// export class ReservationsController {
//   constructor(private readonly reservationsService: ReservationsService) {}

//   // post para crear reservas // patch para editar // get de todas tus reservas de un usuario // get de una sola reserva.

//   @Post(':id')
//   @ApiOperation({ summary: 'Create a new reservation' })
//   @ApiBody({
//     description: 'Data for the new reservation',
//     type: CreateReservationDto,
//   })
//   @ApiResponse({
//     status: 201,
//     description: 'Reservation created successfully.',
//   })
//   @ApiResponse({ status: 400, description: 'Bad request.' })
//   create(@Param() createReservationDto: CreateReservationDto) {
//     return this.reservationsService.createReservation(createReservationDto);
//   }

//   @Get('/:id/all')
//   @ApiOperation({ summary: 'Get all reservations' })
//   @ApiResponse({
//     status: 200,
//     description: 'Returns a list of reservations.',
//   })
//   findAll() {
//     return this.reservationsService.findAll();
//   }

//   @Get(':id')
//   @ApiOperation({ summary: 'Get a specific reservation by ID' })
//   @ApiParam({
//     name: 'id',
//     description: 'ID of the reservation to retrieve',
//     type: 'string',
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Returns the reservation data.',
//   })
//   @ApiResponse({ status: 404, description: 'Reservation not found.' })
//   findOne(@Param('id') id: string) {
//     return this.reservationsService.findAllReservationsByUser(id);
//   }
// }
