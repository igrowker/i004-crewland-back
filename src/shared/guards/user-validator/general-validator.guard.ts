import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { ReservationsService } from '../../../modules/reservations/reservations.service';
import { PublicationsService } from '../../../modules/publications/publications.service';
import { FestivalService } from 'src/modules/festivals/festival.service';

@Injectable()
export class GeneralEntityValidationGuard implements CanActivate {
    constructor(
        // private readonly reservationsService: ReservationsService,
        private readonly publicationsService: PublicationsService,
        private readonly festivalService: FestivalService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user; // token
        const entityType = request.params.entityType;
        //si se usa de esta manera, en los controller en vez de usar :id habria que usarlo como :entityType/id para saber cual de las entidades vamos a validar
        const entityId = request.params.id;

        switch (entityType) {
            case 'user':
                return this.validateUser(user, entityId);

            // case 'reservation':
            //     return this.validateReservation(user, entityId);

            case 'publication':
                return this.validatePublication(user, entityId);

            case 'festival':
                return this.validateFestival(user, entityId);

            default:
                throw new ForbiddenException('Entidad no soportada');
        }
    }

    private async validateUser(user: any, entityId: string): Promise<boolean> {

        if (user.sub !== entityId) {
            throw new ForbiddenException('No tienes permiso para acceder a este usuario');
        }
        return true;
    }

    // private async validateReservation(user: any, entityId: string): Promise<boolean> {
    //     const reservation = await this.reservationsService.findOne(entityId);
    //     if (!reservation) {
    //         throw new ForbiddenException('Reserva no encontrada');
    //     }

    //     if (reservation.userId !== user.sub) {
    //         throw new ForbiddenException('No tienes permiso para acceder a esta reserva');
    //     }
    //     return true;
    // }

    private async validatePublication(user: any, entityId: string): Promise<boolean> {
        const publication = await this.publicationsService.findOne(entityId);
        if (!publication) {
            throw new ForbiddenException('Publicación no encontrada');
        }

        if (publication.userId !== user.sub) {
            throw new ForbiddenException('No tienes permiso para acceder a esta publicación');
        }
        return true;
    }

    private async validateFestival(user: any, entityId: string): Promise<boolean> {
        const festival = await this.festivalService.findOne(entityId);
        if (!festival) {
            throw new ForbiddenException('Festival no encontrado');
        }

        //no se se se va a comparar de momento

        return true;
    }
}
