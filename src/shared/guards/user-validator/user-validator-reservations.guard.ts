import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { ReservationsService } from '../../../modules/reservations/reservations.service';

@Injectable()
export class ReservationValidationUser implements CanActivate {
    constructor(private readonly reservationsService: ReservationsService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const reservationId = request.params.id;

        const reservation = await this.reservationsService.findOne(reservationId);
        if (!reservation) {
            throw new ForbiddenException('Reserva no encontrada');
        }

        // if (reservation.userId !== user.id) {
        //     throw new ForbiddenException(
        //         'No tienes permiso para acceder a esta reserva.',
        //     );
        // }

        return true;
    }
}
