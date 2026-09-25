import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { NotesController } from './notes.controller.js';
import { NotesService } from './notes.services.js';
import INote from './note.interface.js';
import { SessionAuthGuard } from '../libs/Guards/SessionAuth.guard.js';

describe('NotesController', () => {
  let controller: NotesController;
  let service: NotesService;

  // Мок-об'єкт сервісу за допомогою vi.fn()
  const mockNotesService = {
    findAll: vi.fn(),
    saveNote: vi.fn(),
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
});