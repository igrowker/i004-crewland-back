import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservations } from './entities/reservation.entity';
import { Repository } from 'typeorm';
import { ReservationAddUserDto } from './dto/reservation.add-user.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservations)
    private readonly reservationsRepository: Repository<Reservations>
  ) { }


  create(createReservationDto: CreateReservationDto) {
    return 'This action adds a new reservation';
  }

  findAll() {
    return `This action returns all reservations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reservation`;
  }

  update(id: number, updateReservationDto: UpdateReservationDto) {
    return `This action updates a #${id} reservation`;
  }

  remove(id: number) {
    return `This action removes a #${id} reservation`;
  }

  async addUserToReservation(addUserDto: ReservationAddUserDto): Promise<Reservations> {
    const { reservationId, userId } = addUserDto

    const reservation = await this.reservationsRepository.findOne({
      where: { id: reservationId }
    })

    if (!reservation) {
      throw new NotFoundException('La reserva no se encuentra')
    }

    if (reservation.userIds.includes(userId)) {
      throw new BadRequestException('El usuario ya pertenece a esa reserva')
    }

    reservation.userIds.push(userId)

    return await this.reservationsRepository.save(reservation)
  }
}
