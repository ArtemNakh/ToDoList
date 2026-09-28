import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Note from './note.entity.js';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import INote from './note.interface.js';
import { SaveNoteDto } from './dto/Services/SaveNote.service.dto.js';
import IUser from '../Users/user.interface.js';
import { UpdateNoteDto } from './dto/Services/UpdateNote.service.dto.js';

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

  /**
   * Remove Note by id
   *
   * @param noteId - Unique Note identity for removal.
   * @param userId - Unique user identity which have this note.
   * @returns {Promise<void>} Empty Promise if successfully result
   * @throws {NotFoundException} Note not found by id in database.
   */
  public async deleteNote(noteId: number, userId: number): Promise<void> {
    const note = await this.notesRepo.findOne({
      where: {
        id: noteId,
        user: { id: userId },
      },
      relations: {
        user: true,
      },
    });
    if (!note || note.user.id != userId) {
      throw new NotFoundException(
        `Note with id: ${noteId} for user with id ${userId} not found`,
      );
    }

    await this.notesRepo.remove(note);
  }

  /**
   * Update note by noteId and userId
   *
   * @param newNote - Dto object that have values for update
   * @returns Updated note with new values
   *
   * @throws {NotFoundException} - If user(by userId) haven`t  current note(by noteId)  
   */
  public async updateNote(newNote: UpdateNoteDto): Promise<INote> {
    const note: INote | null = await this.notesRepo.findOne({
      where: { id: newNote.noteId, user: { id: newNote.userId } },
      relations: { user: true },
    });
    if (!note || note == null || !note.user) {
      throw new NotFoundException(
        `Note with id: ${newNote.noteId}  for user with id:${newNote.userId} not found`,
      );
    }

    Object.assign(note, {
      ...(newNote.content && { content: newNote.content }),
      ...(newNote.title && { title: newNote.title }),
    });

    await this.notesRepo.save(note);
    return note;
  }
}
