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

  @Column({ type: 'varchar', nullable: false })
  description: string;
}

// sacar date y agregar hora y dia por sepado.
// solo los admins pueden crear festivales.

// hace falta agregar una imagen (APLICAR CLOUDINARY SI LLEGAMOS)
// columna imagen manejado con cloudinary
// agregar la url (string)
// agregar cantidad de personas ( string ) y pensar que otra cosa se puede agregar
