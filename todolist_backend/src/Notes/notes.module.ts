import { Module } from '@nestjs/common';
import { NotesService } from './notes.services.js';
import { NotesController } from './notes.controller.js';
import Note from './note.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Note])],
  providers: [NotesService],
  controllers: [NotesController],
})
export class NotesModule {}
