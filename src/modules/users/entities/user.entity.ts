import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role, Gender } from 'src/shared/utils/enum';
// import { Chat } from 'src/modules/chat/entities/chat.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
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

  // @ManyToMany(() => Chat, (chat) => chat.usuarios)
  // chats: Chat[];
}

// agregar imagen con cloudinary
// descripcion
// location ( string )
