import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservations } from './entities/reservation.entity';
import { Repository } from 'typeorm';
import { ReservationAddUserDto } from './dto/reservation.add-user.dto';
import { ReservationAddUsersDto } from './dto/reservation.add-more-users.dto';
import { ReservationRemoveUserDto } from './dto/reservation.remove-user.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservations)
    private readonly reservationsRepository: Repository<Reservations>
  ) { }


  async createReservation(createReservationDto: CreateReservationDto): Promise<Reservations> {
    const { type, postId, userIds = [] } = createReservationDto

    const existingReservation = await this.reservationsRepository.findOne({
      where: { postId }
    })
    if (existingReservation) {
      throw new BadRequestException('Una reserva ya esta asociada a este post')
    }

    const reservation = this.reservationsRepository.create({
      type,
      postId,
      userIds,
    })

    return await this.reservationsRepository.save(reservation)
  }

  // findAll() {
  //   return `This action returns all reservations`;
  // }

  async getReservationById(reservationId: string): Promise<Reservations> {
    const reservation = await this.reservationsRepository.findOne({
      where: { id: reservationId }
    })

    if (!reservation) {
      throw new NotFoundException('La reserva no se ha encontrado.')
    }

    return reservation
  }

  // update(id: number, updateReservationDto: UpdateReservationDto) {
  //   return `This action updates a #${id} reservation`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} reservation`;
  // }

  async addUserToReservation(reservationId: string, addUserDto: ReservationAddUserDto): Promise<Reservations> {
    const { userId } = addUserDto

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

  async addUsersToReservation(reservationId: string, addUsersDto: ReservationAddUsersDto): Promise<Reservations> {
    const { userIds: newUserIds } = addUsersDto

    const reservation = await this.reservationsRepository.findOne({
      where: { id: reservationId }
    })

    if (!reservation) {
      throw new NotFoundException('La reserva no se encuentra')
    }

    const existingUserIds = reservation.userIds
    const duplicateUserIds = newUserIds.filter((id) => existingUserIds.includes(id))

    if (duplicateUserIds.length > 0) {
      throw new BadRequestException(`Algunos usuarios ya pertenecen a esta reserva: ${duplicateUserIds.join(', ')}`)
    }

    reservation.userIds.push(...newUserIds)

    return await this.reservationsRepository.save(reservation)
  }

  async removeUserFromReservation(reservationId: string, removeUserDto: ReservationRemoveUserDto): Promise<Reservations> {
    const { userId } = removeUserDto

    const reservation = await this.reservationsRepository.findOne({
      where: { id: reservationId }
    })

    if (!reservation) {
      throw new NotFoundException('La reserva no fue encontrada')
    }

    if (!reservation.userIds.includes(userId)) {
      throw new BadRequestException('El usuario no pertenece a esta reserva.')
    }

    reservation.userIds = reservation.userIds.filter((id) => id !== userId)

    return await this.reservationsRepository.save(reservation)
  }
}
