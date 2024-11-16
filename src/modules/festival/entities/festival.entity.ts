// import { ObjectId } from 'typeorm';

// export class Festival {
//   _id: ObjectId;
//   name: string;
//   location: string;
//   date: Date;
//   description: string;
// }

import { Entity, PrimaryGeneratedColumn, Column, ObjectId } from 'typeorm';

@Entity({
  name: 'festival',
})
export default class Festival {
  @PrimaryGeneratedColumn()
  id: ObjectId;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  date: string;

  @Column()
  description: string;
}
