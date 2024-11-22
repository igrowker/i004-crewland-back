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

  @Column({ type: 'varchar', nullable: false })
  date: string;

  //separar date en hora y dia

  @Column({ type: 'varchar', nullable: false })
  description: string;
}
