import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../Users/user.entity.js';
import INote from './note.interface.js';
import type IUser from '../Users/user.interface.js';

@Entity('notes')
class Note implements INote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  title: string;

  @Column({ name: 'content_json', type: 'mediumtext', nullable: true })
  content: string;

  @ManyToOne(() => User, (user: IUser) => user.notes)
  @JoinColumn({ name: 'user_id' })
  user: IUser;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  constructor(partial?: Partial<Note>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }

  /**
   * Validation full note object
   * 
   * @returns if note valid return true if not valid return false
   */
  isValid(): Boolean {
    return (
      typeof this.id === 'number' &&
      typeof this.title === 'string' &&
      this.title.trim().length > 0 &&
      Boolean(this.user && this.user.id) &&
      this.created_at instanceof Date &&
      this.updated_at instanceof Date
    );
  }
/**
 * Validation note object for create to the database
 * 
 * @returns true if note object valid for create else false
 */
  canBeCreated(): boolean {
    return (
      typeof this.title === 'string' &&
      this.title.trim().length > 0 &&
      Boolean(this.user && typeof this.user.id === 'number')
    );
  }
}

export default Note;
