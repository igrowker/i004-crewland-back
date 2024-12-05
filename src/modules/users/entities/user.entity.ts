// import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
// import { Role, Gender } from 'src/shared/utils/enum';
// import { Message } from 'src/modules/chat/entities/chat.entity';

// @Entity('users')
// export class User {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({ type: 'varchar', nullable: false })
//   password: string;

//   @Column({ type: 'varchar', nullable: false })
//   name: string;

//   @Column({ type: 'varchar', unique: true, nullable: false })
//   username: string;

//   @Column({ type: 'varchar', unique: true, nullable: false })
//   email: string;

//   @Column({ type: 'varchar', nullable: false })
//   age: string;

//   @Column({ type: 'varchar', unique: true, nullable: false })
//   tel: string;

//   @Column({
//     type: 'enum',
//     enum: Gender,
//   })
//   gender: string;

//   @Column({
//     type: 'enum',
//     enum: Role,
//     default: Role.User,
//   })
//   role: string;

//   @Column({ type: 'simple-array', nullable: true })
//   preferences: string[];

//   @Column({ type: 'simple-array', nullable: true })
//   travelHistory: string[];

//   @Column({ type: 'simple-array', nullable: true })
//   favorites: string[];

//   @ManyToMany(() => Message, (chat) => chat.senderId)
//   chats: Message[];
// }

// agregar imagen con cloudinary
// descripcion
// location ( string)
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role, Gender } from 'src/shared/utils/enum';
import { Message } from 'src/modules/chat/entities/message.entity';
import { Exclude, instanceToPlain } from 'class-transformer';
import { Publication } from 'src/modules/publications/entities/publication.entity';
import { Room } from 'src/modules/chat/entities/room.entity';

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

  // Relación con publicaciones
  @OneToMany(() => Publication, (publication) => publication.user)
  publications: Publication[];

  @ManyToMany(() => Room, (room) => room.users)
  rooms: Room[];

  toJSON() {
    return instanceToPlain(this);
  }
}

// descripcion
// location ( string ) A VER!!!
