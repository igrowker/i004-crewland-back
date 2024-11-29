import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('reservations')
export class Reservations {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // array de usuarios que conforman la reservation/crew
  @Column('simple-array')
  userIds: string[];

  // id del post al que se referencia la reservation
  @Column('uuid')
  postId: string;

  // estado de la reserva: solamente active/inactive
  @Column({
    type: 'enum',
    enum: ['active', 'inactive'],
    default: 'active'
  })
  status: 'active' | 'inactive';

  // añadir lastEdited con un timestamp para ver la ultima vez que esa crew ha recibido cambios en los usuarios que pertenecen a ella?
}
