// src/chat/entities/chat.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => User, (user) => user.chats)
  @JoinTable()
  usuarios: User[];

  @Column({ type: 'jsonb', default: [] })
  messages: { message: string; userId: string; date: Date }[];
}
