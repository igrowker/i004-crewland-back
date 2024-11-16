import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({
  name: 'festival',
})
export default class Festival {
  @PrimaryGeneratedColumn('uuid') //no usar ObjectId ya q es un tipo de dato para MongoDB y nosotros usamos postgresql
  id: string;

  @Column({ type: 'text', nullable: false }) //para q el campo sea obligatorio de completar y no permitir q quede vacio
  name: string;

  @Column({ type: 'text', nullable: false })
  location: string;

  @Column({ type: 'text', nullable: false })
  date: string;

  @Column({ type: 'text', nullable: false })
  description: string;
}
