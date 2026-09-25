import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import INote from './note.interface.js';
import { NotesService } from './notes.services.js';
import { GetCurrentUser } from '../libs/Decorators/GetCurrentSession.js';
import { SessionAuthGuard } from '../libs/Guards/SessionAuth.guard.js';
import { SaveNoteBodyDto } from './dto/Body/SaveNote.body.dto.js';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { NoteResponseDto } from './dto/Response/Note.response.dto.js';
import { ApiSaveNote } from './dto/ApiSwager/SaveNote.api.js';

@Controller('Notes')
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
}
