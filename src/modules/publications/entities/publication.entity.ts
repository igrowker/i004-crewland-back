import { Type } from 'src/shared/utils/enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';

@Entity({
  name: 'publications',
})
@Index('idx_userId', ['userId'])
@Index('idx_festivalId', ['festivalId'])
export class Publication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  userId: string;

  // @Column({ type: 'enum', enum: ['search', 'offer'] })
  // title: string;

  @Column({
    type: 'enum',
    enum: Type,
    nullable: false
  })
  type: Type;

  @Column({ type: 'uuid', nullable: false })
  festivalId: string;

  @Column({ type: 'varchar', nullable: false })
  details: string;

  @Column({ type: 'varchar', nullable: false })
  availability: string;

  @CreateDateColumn({ nullable: false })
  dateCreation: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}

