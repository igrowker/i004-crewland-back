/* eslint-disable prettier/prettier */
import { Type } from 'src/shared/utils/enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('reservations')
export class Reservations {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // array de usuarios que conforman la reservation/crew
  @Column('simple-array', { nullable: true })
  userIds: string[];

  @Column()
  peopleAmount: number;

  // id del post al que se referencia la reservation
  @Column('uuid')
  postId: string;

  // tipo de reserva (crew/accomodation/transport)
  @Column({
    type: 'enum',
    enum: Type,
    default: Type.Crew,
  })
  type: Type;

  // estado de la reserva: solamente active/inactive
  @Column({
    type: 'enum',
    enum: ['active', 'inactive'],
    default: 'active',
  })
  status: 'active' | 'inactive';

  // timestamp de cuando ha sido creada
  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  createdAt: Date;

  // timestamp para ver la ultima vez que esa crew ha recibido cambios
  @UpdateDateColumn({
    type: 'timestamp',
    name: 'last_edited',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastEdited: Date;
}
