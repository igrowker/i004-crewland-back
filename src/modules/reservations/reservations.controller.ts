import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationAddUserDto } from './dto/reservation.add-user.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) { }

  @Post()
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.create(createReservationDto);
  }

  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsService.update(+id, updateReservationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(+id);
  }

  @Post('add-user')
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
    @Body() addUserDto: ReservationAddUserDto
  ) {
    return await this.reservationsService.addUserToReservation(addUserDto)
  }

}
