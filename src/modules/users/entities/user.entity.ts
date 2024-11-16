import { IsOptional } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'user',
})
export default class User {
  @PrimaryGeneratedColumn('uuid') //depende de como se origine la id se usa PrimaryColumn
  id: string;

  // @PrimaryColumn()
  // id: string

  @Column()
  name: string;

  @Column()
  @IsOptional()
  age: number;

  @Column({ type: 'text', nullable: true })
  password: string;

  @Column()
  email: string;

  @Column()
  @IsOptional()
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
  @IsOptional()
  preferences: string[];

  @Column({
    type: 'text',
    array: true,
    nullable: true,
  })
  @IsOptional()
  travelHistory: string[];

  @Column({
    type: 'text',
    array: true,
    nullable: true,
  })
  @IsOptional()
  favorites: string[];
}
