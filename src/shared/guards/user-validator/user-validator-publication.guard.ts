import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PublicationsService } from '../../../modules/publications/publications.service';

@Injectable()
export class PublicationValidationUser implements CanActivate {
  constructor(private readonly publicationService: PublicationsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const publicationId = request.params.id;

    const publication = await this.publicationService.findOne(publicationId);
    if (!publication) {
      throw new ForbiddenException('Publicación no encontrada');
    }

    console.log(publication.userId, user.id);
    if (publication.userId !== user.id) {
      throw new ForbiddenException(
        'No tienes permiso para acceder a esta publicación.',
      );
    }

    return true;
  }
}
