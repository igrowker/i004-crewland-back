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
      throw new ForbiddenException('Publication not found');
    }

    if (publication.userId !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to modify this publication',
      );
    }

    return true;
  }
}
