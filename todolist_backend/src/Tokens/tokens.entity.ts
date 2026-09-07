import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IToken } from './token.interface.js';

export enum TokenType {
  VERIFICATION = 'VERIFICATION',
  PASSWORD_RESET = 'PASSWORD_RESET',
}


@Entity({ name: 'tokens' })
export class Token implements IToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  token: string;

  @Column({ type: 'enum', enum: TokenType })
  type: TokenType;

  @Column({ name: 'expires_in', type: 'timestamp' })
  expiresIn: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
