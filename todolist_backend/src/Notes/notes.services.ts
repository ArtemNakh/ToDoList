import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Note from './note.entity.js';
import { BadRequestException, Injectable } from '@nestjs/common';
import INote from './note.interface.js';
import { SaveNoteDto } from './dto/Services/SaveNote.dto.js';
import IUser from '../Users/user.interface.js';

@Injectable()
export class NotesService {
  constructor(@InjectRepository(Note) private notesRepo: Repository<Note>) {}

  findAll(): Promise<Note[]> {
    return this.notesRepo.find();
  }

  /**
   * After the note is validated, it is saved to the dataabase
   *
   * @param note - Note object, that implements the interface
   * @returns Note object, that was saved to the database
   *
   * @throws {BadRequestException} thrown when the note object fails the validation check
   */
  public async saveNote(note: SaveNoteDto): Promise<INote> {
    const newNote = new Note({
      title: note.title,
      content: note.content,
      user: { id: note.user.id } as IUser,
    });

    if (!newNote.canBeCreated()) {
      throw new BadRequestException('Note data is invalid');
    }

    const savedNote = await this.notesRepo.save(newNote);

    return savedNote;
  }
}
