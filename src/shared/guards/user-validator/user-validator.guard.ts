import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { UsersService } from '../../../modules/users/users.service';

@Injectable()
export class UserValidation implements CanActivate {
    constructor(private readonly usersService: UsersService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const userId = request.params.id;

        if (userId !== user.sub) {
            throw new ForbiddenException(
                'No tienes permiso para acceder a esta información de usuario.',
            );
        }

        return true;
    }
}
