/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Message } from './message.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Message, (message) => message.room, { eager: true })
  messages: Message[];

  @ManyToMany(() => User, (user) => user.rooms)
  // @JoinTable()
  // @JoinTable()
  // @JoinColumn({ name: 'userId' })
  users: User[];
}
