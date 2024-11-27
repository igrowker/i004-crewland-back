import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({
  name: 'festivals',
})
export class Festivals {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  location: string;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @Column({ type: 'time', nullable: false })
  time: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ type: 'varchar', nullable: false })
  url?: string;

  @Column({ type: 'int', nullable: false })
  attendeesCount?: number;

  @Column({ type: 'simple-array', nullable: false })
  image: string[];
}
