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

  @Column({ type: 'uuid' })
  userId: string;

  // @Column({ type: 'enum', enum: ['search', 'offer'] })
  // title: string;

  @Column({ type: 'enum', enum: ['crew', 'transport', 'accommodation'] })
  type: string;

  @Column({ type: 'uuid' })
  festivalId: string;

  @Column({ type: 'text' })
  details: string;

  @Column({ type: 'text' })
  availability: string;

  @CreateDateColumn()
  dateCreation: Date;

  // @Column({ type: 'boolean', default: true })
  // isActive: boolean;

}

export default Publication;
