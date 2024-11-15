import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'users',
})
export default class User {
  @PrimaryGeneratedColumn('uuid') //depende de como se origine la id se usa PrimaryColumn
  id: string;

  // @PrimaryColumn()
  // id: string

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  gender: string;

  @Column({
    type: 'enum',
    enum: ['searching', 'offering'],
    default: 'offering',
  })
  role: string;

  @Column({
    type: 'text',
    array: true,
    nullable: true,
  })
  preferences: string[]; //puede ser un enum con strings acordadas (cambiar decorador)

  @Column({
    type: 'text',
    array: true,
    nullable: true,
  })
  travelHistory: string[];

  @Column({
    type: 'text',
    array: true,
    nullable: true,
  })
  favorites: string[]; //array de festivales cuando este creado (cambiar decorador)
}
