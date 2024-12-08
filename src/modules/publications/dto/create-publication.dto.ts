import {
  TitleProperty,
  TypeProperty,
  FestivalIdProperty,
  DetailsProperty,
  MaxParticipantsProperty,
  ParticipantsProperty,
  CreationDateProperty,
  CreationTimeProperty,
  ImageUrlProperty,
} from 'src/shared/dto-properties/publications-properties';
import { Type } from 'src/shared/utils/enum';

export class CreatePublicationDto {
  @TitleProperty()
  title: string;

  @TypeProperty()
  type: Type;

  @FestivalIdProperty()
  festivalId?: string;

  @DetailsProperty()
  details: string;

  @MaxParticipantsProperty()
  maxParticipants: number;

  @ParticipantsProperty()
  participants?: string[];

  @CreationDateProperty()
  creationDate?: string;

  @CreationTimeProperty()
  creationTime?: string;

  @ImageUrlProperty()
  imageUrl?: string;
}
