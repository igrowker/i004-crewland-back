/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservations } from './entities/reservation.entity';
import { Repository } from 'typeorm';
import { ReservationAddUserDto } from './dto/reservation.add-user.dto';
import { ReservationAddUsersDto } from './dto/reservation.add-more-users.dto';
import { ReservationRemoveUserDto } from './dto/reservation.remove-user.dto';
import { ReservationUpdateTypeDto } from './dto/reservation.update-type.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservations)
    private readonly reservationsRepository: Repository<Reservations>,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
  ): Promise<Reservations> {
    try {
      const { type, postId, userIds = [] } = createReservationDto;

      const existingReservation = await this.reservationsRepository.findOne({
        where: { postId },
      });
      if (existingReservation) {
        throw new BadRequestException(
          'Una reserva ya esta asociada a este post',
        );
      }

      const reservation = this.reservationsRepository.create({
        type,
        postId,
        userIds,
        peopleAmount : createReservationDto.peopleAmount,
      });

      return await this.reservationsRepository.save(reservation);
    } catch (error) {
      throw new BadRequestException(
        'Se han enviado datos inválidos mientras se creaba la reserva.',
      );
    }
  }

  async findOne(reservationId: string): Promise<Reservations> {
    try {
      const reservation = await this.reservationsRepository.findOne({
        where: { id: reservationId },
      });

      if (!reservation) {
        throw new NotFoundException('La reserva no se ha encontrado.');
      }

      return reservation;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Ha surgido un error inesperado.');
    }
  }

  async findAll() {
    try {
      return await this.reservationsRepository.find({
        relations: ['users'],
      });
    } catch (error) {
      throw new Error(`Error fetching reservations`);
    }
  }

  async updateType(
    reservationId: string,
    reservationUpdateTypeDto: ReservationUpdateTypeDto,
  ): Promise<Reservations> {
    try {
      const { type } = reservationUpdateTypeDto;

      const reservation = await this.reservationsRepository.findOne({
        where: { id: reservationId },
      });

      if (!reservation) {
        throw new NotFoundException('La reserva no se ha encontrado.');
      }

      reservation.type = type;

      return await this.reservationsRepository.save(reservation);
    } catch (error) {}
  }

  async remove(reservationId: string): Promise<void> {
    try {
      const reservation = await this.reservationsRepository.findOne({
        where: { id: reservationId },
      });

      if (!reservation) {
        throw new NotFoundException('La reserva no se ha encontrado');
      }

      await this.reservationsRepository.delete(reservationId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Ha surgido un error mientras se borraba la reserva.',
      );
    }
  }

  async addUserToReservation(
    reservationId: string,
    addUserDto: ReservationAddUserDto,
  ): Promise<Reservations> {
    try {
      const { userId } = addUserDto;

      const reservation = await this.reservationsRepository.findOne({
        where: { id: reservationId },
      });

      if (!reservation) {
        throw new NotFoundException('La reserva no se encuentra');
      }

      if (reservation.userIds.includes(userId)) {
        throw new BadRequestException('El usuario ya pertenece a esa reserva');
      }

      reservation.userIds.push(userId);

      return await this.reservationsRepository.save(reservation);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Ha surgido un error añadiendo el usuario a la reserva',
      );
    }
  }

  async addUsersToReservation(
    reservationId: string,
    addUsersDto: ReservationAddUsersDto,
  ): Promise<Reservations> {
    try {
      const { userIds: newUserIds } = addUsersDto;

      const reservation = await this.reservationsRepository.findOne({
        where: { id: reservationId },
      });

      if (!reservation) {
        throw new NotFoundException('La reserva no se encuentra');
      }

      const existingUserIds = reservation.userIds;
      const duplicateUserIds = newUserIds.filter((id) =>
        existingUserIds.includes(id),
      );

      if (duplicateUserIds.length > 0) {
        throw new BadRequestException(
          `Algunos usuarios ya pertenecen a esta reserva: ${duplicateUserIds.join(', ')}`,
        );
      }

      reservation.userIds.push(...newUserIds);

      return await this.reservationsRepository.save(reservation);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Ha surgido un error añadiendo los usuarios a la reserva',
      );
    }
  }

  async removeUserFromReservation(
    reservationId: string,
    removeUserDto: ReservationRemoveUserDto,
  ): Promise<Reservations> {
    try {
      const { userId } = removeUserDto;

      const reservation = await this.reservationsRepository.findOne({
        where: { id: reservationId },
      });

      if (!reservation) {
        throw new NotFoundException('La reserva no fue encontrada');
      }

      if (!reservation.userIds.includes(userId)) {
        throw new BadRequestException(
          'El usuario no pertenece a esta reserva.',
        );
      }

      reservation.userIds = reservation.userIds.filter((id) => id !== userId);

      return await this.reservationsRepository.save(reservation);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Ha surgido un error eliminando el usuario de la reserva',
      );
    }
  }
}
