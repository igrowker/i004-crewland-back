import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({
  name: 'festivals',
})
export class Festival {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  location: string;

  @Column({ type: 'date', nullable: false })
  date: string;

  @Column({ type: 'time', nullable: false })
  time: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;
}
