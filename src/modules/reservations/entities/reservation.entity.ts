import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity('reservations')
export class Reservations {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  usuarioId: ObjectId;

  @Column()
  postId: ObjectId;

  @Column()
  estado: string;
}
