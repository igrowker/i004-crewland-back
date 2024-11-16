import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('reservations')
export class Reservations {
  @PrimaryGeneratedColumn('uuid') //OJO: no usar ObjectId ya q es un tipo de dato para MongoDB y nosotros usamos postgresql
  id: string;

  @Column('uuid')
  usuarioId: string;

  @Column('uuid')
  postId: string;

  @Column({ type: 'text', default: 'OK' }) //mirar un posible valor por defecto, dejo un ejem pero lo pueden cambiar
  estado: string;
}
