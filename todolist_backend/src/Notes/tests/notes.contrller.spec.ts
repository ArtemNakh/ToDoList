import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { vi, describe, it, expect, beforeEach, Mocked } from 'vitest';
import { NotesController } from '../notes.controller.js';
import { NotesService } from '../notes.services.js';
import INote from '../note.interface.js';
import { SessionAuthGuard } from '../../libs/Guards/SessionAuth.guard.js';
import { RemoveNoteDto } from '../dto/Param/RemoveNote.param.dto.js';
import { UpdateNoteBodyDto } from '../dto/Body/UpdateNote.body.dto.js';
import { UpdateNoteParamDto } from '../dto/Param/UpdateNote.param.dto.js';
import { title } from 'process';

describe('NotesController', () => {
  let controller: NotesController;
  let service: NotesService;

  // Мок-об'єкт сервісу за допомогою vi.fn()
  const mockNotesService = {
    findAll: vi.fn(),
    saveNote: vi.fn(),
    deleteNote: vi.fn(),
    updateNote: vi.fn(),
  };

  // Тестові дані
  const mockNote: INote = {
    id: 1,
    title: 'Test Note',
    content: 'Test Content',
    user: { id: 2 } as any,
    created_at: new Date(),
    updated_at: new Date(),
    isValid: () => true,
    canBeCreated: () => true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        {
          provide: NotesService,
          useValue: mockNotesService,
        },
      ],
    })
      .overrideGuard(SessionAuthGuard)
      .useValue({
        canActivate: (context: any) => {
          // Симулюємо успішну авторизацію та додаємо userId до request.session/user
          const req = context.switchToHttp().getRequest();
          req.session = { userId: 2 };
          return true;
        },
      })
      .compile();

    controller = module.get<NotesController>(NotesController);
    service = module.get<NotesService>(NotesService);

    // Очищаємо моки перед кожним тестом
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('saveNote (POST /Notes/v1/save)', () => {
    it('should successfully create and return a note', async () => {
      const bodyDto = {
        title: 'New Note',
        content: 'Some content',
      };
      const userId = 2;

      mockNotesService.saveNote.mockResolvedValue({
        id: 11,
        ...bodyDto,
        user: { id: userId },
        created_at: new Date(),
        updated_at: new Date(),
      });

      const result = await controller.saveNote(bodyDto, userId);

      expect(service.saveNote).toHaveBeenCalledTimes(1);
      expect(service.saveNote).toHaveBeenCalledWith({
        title: bodyDto.title,
        content: bodyDto.content,
        user: { id: userId },
      });
      expect(result).toHaveProperty('id', 11);
      expect(result.title).toEqual(bodyDto.title);
    });

    it('should throw BadRequestException if service throws validation error', async () => {
      const bodyDto = {
        title: '', // Невалідні дані
        content: 'Some content',
      };
      const userId = 2;

      mockNotesService.saveNote.mockRejectedValue(
        new BadRequestException('Note data is invalid'),
      );

      await expect(controller.saveNote(bodyDto, userId)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.saveNote).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeNote', () => {
    const mockParams: RemoveNoteDto = { noteId: 1 };
    const mockUserId = 2;

    it('should successfully remove a note and return undefined', async () => {
      mockNotesService.deleteNote.mockResolvedValue(undefined);

      const result = await controller.removeNote(mockParams, mockUserId);

      expect(mockNotesService.deleteNote).toHaveBeenCalledTimes(1);
      expect(mockNotesService.deleteNote).toHaveBeenCalledWith(
        mockParams.noteId,
        mockUserId,
      );
      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException if note does not exist', async () => {
      const error = new NotFoundException('Note not found');
      mockNotesService.deleteNote.mockRejectedValue(error);

      await expect(
        controller.removeNote(mockParams, mockUserId),
      ).rejects.toThrow(NotFoundException);

      expect(mockNotesService.deleteNote).toHaveBeenCalledWith(
        mockParams.noteId,
        mockUserId,
      );
    });

    it('should throw ForbiddenException if user does not own the note', async () => {
      const error = new ForbiddenException(
        'You are not allowed to delete this note',
      );
      mockNotesService.deleteNote.mockRejectedValue(error);

      await expect(
        controller.removeNote(mockParams, mockUserId),
      ).rejects.toThrow(ForbiddenException);

      expect(mockNotesService.deleteNote).toHaveBeenCalledWith(
        mockParams.noteId,
        mockUserId,
      );
    });

    it('should throw InternalServerErrorException on unexpected database or service failure', async () => {
      const error = new InternalServerErrorException('Database failure');
      mockNotesService.deleteNote.mockRejectedValue(error);

      await expect(
        controller.removeNote(mockParams, mockUserId),
      ).rejects.toThrow(InternalServerErrorException);

      expect(mockNotesService.deleteNote).toHaveBeenCalledWith(
        mockParams.noteId,
        mockUserId,
      );
    });
  });

  describe('updateNote', () => {
    const mockUserId = 1;
    const mockParams: UpdateNoteParamDto = { noteId: 1 };

    it('Must successfully  send title and content value into service and get as updated note as result ', async () => {
      const mockBody: UpdateNoteBodyDto = {
        title: 'newTitle',
        content: 'newContent',
      };

      const mockUpdatedNote = {
        id: 1,
        title: 'newTitle',
        content: 'newContent',
        user: { id: 1 },
      };

      mockNotesService.updateNote.mockResolvedValue(mockUpdatedNote);

      //Act

      const result = await controller.updateNote(
        mockParams,
        mockBody,
        mockUserId,
      );

      //Assert
      expect(mockNotesService.updateNote).toHaveBeenCalledWith({
        title: mockBody.title,
        content: mockBody.content,
        userId: mockUserId,
        noteId: mockParams.noteId,
      });
      expect(mockNotesService.updateNote).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUpdatedNote);
    });

    it('Must successfully  send title value into service and get as updated note as result ', async () => {
      const mockBody: UpdateNoteBodyDto = {
        title: 'newTitle',
      };

      const mockUpdatedNote = {
        id: 1,
        title: 'newTitle',
        content: 'newContent',
        user: { id: 1 },
      };

      mockNotesService.updateNote.mockResolvedValue(mockUpdatedNote);

      //Act

      const result = await controller.updateNote(
        mockParams,
        mockBody,
        mockUserId,
      );

      //Assert
      expect(mockNotesService.updateNote).toHaveBeenCalledWith({
        title: mockBody.title,
        userId: mockUserId,
        noteId: mockParams.noteId,
      });
      expect(mockNotesService.updateNote).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUpdatedNote);
    });

    it('Must successfully  send content value into service and get as updated note as result ', async () => {
      const mockBody: UpdateNoteBodyDto = {
        content: 'newContent',
      };

      const mockUpdatedNote = {
        id: 1,
        title: 'newTitle',
        content: 'newContent',
        user: { id: 1 },
      };

      mockNotesService.updateNote.mockResolvedValue(mockUpdatedNote);

      //Act

      const result = await controller.updateNote(
        mockParams,
        mockBody,
        mockUserId,
      );

      //Assert
      expect(mockNotesService.updateNote).toHaveBeenCalledWith({
        content: mockBody.content,
        userId: mockUserId,
        noteId: mockParams.noteId,
      });
      expect(mockNotesService.updateNote).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUpdatedNote);
    });

    it('Must reject error NotFound Exception, if service return rrror', async () => {
      // Arrange
      const mockBody: UpdateNoteBodyDto = {
        title: 'New Title',
      };
      const error = new NotFoundException(
        'Note with id: 10 for user with id: 1 not found',
      );
      mockNotesService.updateNote.mockRejectedValue(error);

      await expect(
        controller.updateNote(mockParams, mockBody, mockUserId),
      ).rejects.toThrow(NotFoundException);

      expect(mockNotesService.updateNote).toHaveBeenCalledWith({
        title: mockBody.title,
        content: undefined,
        userId: mockUserId,
        noteId: mockParams.noteId,
      });
    });
  });
});
