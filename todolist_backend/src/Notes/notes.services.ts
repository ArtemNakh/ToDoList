import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Note from './note.entity.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotesService {
  constructor(@InjectRepository(Note) private notesRepo: Repository<Note>) {}

  findAll(): Promise<Note[]> {
    return this.notesRepo.find();
  }
}
