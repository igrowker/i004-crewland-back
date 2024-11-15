import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('reservations')
export class Reservations {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  usuarioId: string;

  @Column('uuid')
  postId: string;

  @Column()
  estado: string;
}
