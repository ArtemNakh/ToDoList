import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../Users/user.entity.js';
import INote from './note.interface.js';
import type IUser from '../Users/user.interface.js';

@Entity()
class Note implements INote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ name: 'content_json', nullable: true })
  content: string;

  @ManyToOne(() => User, (user: IUser) => user.notes)
  user: IUser;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}

export default Note;
