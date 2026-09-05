import { Module } from '@nestjs/common';
import { NotesService } from './notes.services.js';
import { NotesController } from './notes.controller.js';

@Module({
  imports: [],
  providers: [NotesService],
  controllers: [NotesController],
})
export class NotesModule {}
