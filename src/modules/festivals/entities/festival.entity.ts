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

  //separar date en hora y dia

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ type: 'varchar', nullable: false })
  url?: string;

  @Column({ type: 'int', nullable: false })
  attendeesCount?: number;

  @Column({ type: 'simple-array', nullable: false })
  image: string[];
}

// sacar date y agregar hora y dia por sepado.
// solo los admins pueden crear festivales.

// hace falta agregar una imagen (APLICAR CLOUDINARY SI LLEGAMOS)
// columna imagen manejado con cloudinary
// agregar la url (string)
// agregar cantidad de personas ( string ) y pensar que otra cosa se puede agregar
