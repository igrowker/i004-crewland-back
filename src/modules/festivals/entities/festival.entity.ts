import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity({
  name: 'festivals',
})
@Index(['name', 'date'], { unique: true })
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
  url: string;

  @Column({ type: 'int', nullable: false })
  attendeesCount: number;

  @Column({ type: 'simple-array', nullable: false })
  images: string[];

  @Column({ type: 'simple-array', nullable: true })
  imageUrls?: string[];
}
