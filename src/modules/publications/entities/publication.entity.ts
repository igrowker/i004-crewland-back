import { User } from 'src/modules/users/entities/user.entity';
import { Type } from 'src/shared/utils/enum';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({
  name: 'publications',
})
@Index('idx_festivalId', ['festivalId'])
export class Publication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: Type,
    nullable: false,
  })
  type: Type;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @Column({ type: 'uuid', nullable: false })
  festivalId: string;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  details: string;

  @Column({ type: 'int', nullable: false, default: 0 })
  maxParticipants: number;

  @Column({ type: 'simple-array', nullable: false, default: '' })
  participants: string[];

  @Column({ type: 'varchar', nullable: false })
  creationDate: string;

  @Column({ type: 'varchar', nullable: false })
  creationTime: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string;

  // Relación con el usuario
  @ManyToOne(() => User, (user) => user.publications, { eager: true })
  @JoinColumn({ name: 'userId' }) // Clave foránea creada automáticamente
  user: User;
}
