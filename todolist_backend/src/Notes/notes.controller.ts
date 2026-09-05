import { Controller, Get } from '@nestjs/common';
import INote from './note.interface.js';
import { NotesService } from './notes.services.js';

@Controller('Notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get('v1')
  async findAll(): Promise<INote[]> {
    return this.notesService.findAll();
  }
}
