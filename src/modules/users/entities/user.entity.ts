import { IsOptional } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'user',
})
export default class User {
  @PrimaryGeneratedColumn('uuid') //depende de como se origine la id se usa PrimaryColumn
  id: string;

  // @PrimaryGeneratedColumn()
  // id: ObjectId; --> OJO: no seria correcto usar ObjectID ya q este es un valor para MONGODB y nosotros estamos usando Postgresql

  // @Column() --> aca agrego q el campo sea obligatorio
  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ default: 18 }) //agrego valor por defecto ya q si en el body no se pasa nada, pasa el dto pero aca rompe ya q llega un valor null
  @IsOptional()
  age: number;

  // @Column({ type: 'text', nullable: true }) //OJO: aca al poner nullable : true va a permitir q la password quede vacia
  @Column({ type: 'text', nullable: false })
  password: string;

  // @Column()
  @Column({ type: 'text', nullable: false }) // Campo obligatorio,
  //EXTRA: hacer validaciones con los DTO tambien
  email: string;

  //desde el front van a llegar una de 4 opciones: Hombre, Mujer, Otro, no seleccionado (q es el por defecto)
  @Column({ type: 'text', default: 'No especificado' })
  @IsOptional()
  gender: string;

  //DATO: recuerden q ya no se usa seraching o offering como posibles roles, hay un solo usuario con rol de admin y el resto son user
  // @Column({
  //   type: 'enum',
  //   enum: ['searching', 'offering'],
  //   default: 'offering',
  // })
  // role: string;
  @Column({ default: 'user' })
  role: string;

  @Column({
    type: 'text',
    array: true,
    nullable: true, //mirar esto xq no estoy seguro si seria buena idea aceptar valores nulos, creo q lo mejor seria poner en caso de q el usuario no ingrese nada algun valor por defecto
    default: [], //algo como esto (dato : poner '{}' = [])
  })
  @IsOptional()
  preferences: string[];

  @Column({
    type: 'text',
    array: true,
    nullable: true, //idem aqui ojo con permitir valores null
    default: [],
  })
  @IsOptional()
  travelHistory: string[];

  @Column({
    type: 'text',
    array: true,
    nullable: true, //idem aqui con valores null
    default: [],
  })
  @IsOptional()
  favorites: string[];
}
