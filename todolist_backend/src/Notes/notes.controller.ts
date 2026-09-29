import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import INote from './note.interface.js';
import { NotesService } from './notes.services.js';
import { GetCurrentUser } from '../libs/Decorators/GetCurrentSession.js';
import { SessionAuthGuard } from '../libs/Guards/SessionAuth.guard.js';
import { SaveNoteBodyDto } from './dto/Body/SaveNote.body.dto.js';
import { ApiSaveNote } from './dto/ApiSwager/SaveNote.api.js';
import { RemoveNoteDto } from './dto/Param/RemoveNote.param.dto.js';
import { ApiRemoveNote } from './dto/ApiSwager/RemoveNote.api.js';
import { UpdateNoteParamDto } from './dto/Param/UpdateNote.param.dto.js';
import { UpdateNoteBodyDto } from './dto/Body/UpdateNote.body.dto.js';
import { ApiUpdateNote } from './dto/ApiSwager/UpdateNote.api.dto.js';
import { ApiGetNotes } from './dto/ApiSwager/GetNotes.api.js';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get('v1')
  async findAll(): Promise<INote[]> {
    return this.notesService.findAll();
  }

  @Post('v1/save')
  @UseGuards(SessionAuthGuard)
  @ApiSaveNote()
  async saveNote(
    @Body() noteDto: SaveNoteBodyDto,
    @GetCurrentUser() userId: number,
  ): Promise<INote> {
    const newNote = await this.notesService.saveNote({
      title: noteDto.title,
      content: noteDto.content,
      user: { id: userId },
    });

    return newNote;
  }

  @Delete('v1/remove/:noteId')
  @UseGuards(SessionAuthGuard)
  @ApiRemoveNote()
  async removeNote(
    @Param() params: RemoveNoteDto,
    @GetCurrentUser() userId: number,
  ): Promise<void> {
    const { noteId } = params;

    await this.notesService.deleteNote(noteId, userId);
  }

  @Patch('v1/update/:noteId')
  @UseGuards(SessionAuthGuard)
  @ApiUpdateNote()
  async updateNote(
    @Param() params: UpdateNoteParamDto,
    @Body() body: UpdateNoteBodyDto,
    @GetCurrentUser() userId: number,
  ): Promise<INote> {
    const { noteId } = params;
    const { content, title } = body;

    const newNote = await this.notesService.updateNote({
      title: title,
      content: content,
      userId: userId,
      noteId: noteId,
    });

    return newNote;
  }

  @Get('v1/get-all-by-user')
  @UseGuards(SessionAuthGuard)
  @ApiGetNotes()
  async getNotesByUser(@GetCurrentUser() userId: number) {
    const notes = await this.notesService.GetNotesByUserId(userId);
    return notes;
  }
}
