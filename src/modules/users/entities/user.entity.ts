import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role, Gender } from 'src/shared/utils/enum';
import { Message } from 'src/modules/chat/entities/chat.entity';
import { Exclude, instanceToPlain } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  @Exclude()
  password: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  username: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  age: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  tel: string;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role: string;

  @Column({ type: 'simple-array', nullable: true })
  preferences: string[];

  @Column({ type: 'simple-array', nullable: true })
  travelHistory: string[];

  @Column({ type: 'simple-array', nullable: true })
  favorites: string[];

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @Column({ default: false })
  isDeleted: boolean;

  @ManyToMany(() => Message, (chat) => chat.senderId)
  chats: Message[];

  toJSON() {
    return instanceToPlain(this);
  }
}

// descripcion
// location ( string )
