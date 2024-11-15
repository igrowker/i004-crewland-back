import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'chat' })
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { array: true })
  users: string[];

  @Column('jsonb')
  messages: Array<{ message: string; userId: string; date: Date }>;
}
