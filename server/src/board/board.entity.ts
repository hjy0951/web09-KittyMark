import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Photo } from './photo.entity';

@Entity()
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  isStreet: boolean;

  @Column()
  location: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  // Todo 연관관계 매핑필요
  @Column()
  like: number;

  // Todo 연관관계 매핑필요
  @Column()
  comment: number;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.boards)
  user: User;

  @OneToMany(() => Photo, (photo) => photo.board)
  photos: Photo[];
}
