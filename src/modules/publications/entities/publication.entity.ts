import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'publications',
})
export class Publication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

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
}

export default Publication;
