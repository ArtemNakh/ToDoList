import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import {
  vi,
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  Mocked,
} from 'vitest';
import Note from './note.entity.js';
import { SaveNoteDto } from './dto/Services/SaveNote.dto.js';
import { NotesService } from './notes.services.js';

describe('NotesService', () => {
  let service: NotesService;
  let repo: Mocked<Repository<Note>>;

  // Шаблонний об'єкт для тестових даних
  const mockNote = new Note({
    id: 1,
    title: 'Test Note',
    content: 'Test Content',
    user: { id: 2 } as any,
    created_at: new Date(),
    updated_at: new Date(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: getRepositoryToken(Note),
          useValue: {
            find: vi.fn(),
            save: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
    repo = module.get(getRepositoryToken(Note));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveNote', () => {
    const validDto: SaveNoteDto = {
      title: 'Valid Title',
      content: 'Valid Content',
      user: { id: 2 } as any,
    };

    afterEach(() => {
      vi.restoreAllMocks(); // Очищаємо spyOn після кожного тесту
    });

    // 1. Позитивний сценарій
    it('should successfully create and save a valid note', async () => {
      const savedNote = new Note({
        id: 10,
        title: validDto.title,
        content: validDto.content,
        user: { id: validDto.user.id } as any,
      });
      vi.spyOn(Note.prototype, 'canBeCreated').mockReturnValue(true);
      repo.save.mockResolvedValue(savedNote);

      const result = await service.saveNote(validDto);

      expect(repo.save).toHaveBeenCalledWith(
        expect.objectContaining({ title: validDto.title }),
      );
      expect(result).toEqual(savedNote);
    });

    // 2. Негативний: Бізнес-валідація не пройшла (canBeCreated -> false)
    it('should throw BadRequestException when canBeCreated returns false', async () => {
      vi.spyOn(Note.prototype, 'canBeCreated').mockReturnValue(false);

      await expect(service.saveNote(validDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(repo.save).not.toHaveBeenCalled();
    });

    // 3. Негативний: Помилка збереження в базі даних (наприклад, збій БД або унікальний ключ)
    it('should propagate database exception when repo.save fails', async () => {
      vi.spyOn(Note.prototype, 'canBeCreated').mockReturnValue(true);
      repo.save.mockRejectedValue(new Error('Database connection failure'));

      await expect(service.saveNote(validDto)).rejects.toThrow(
        'Database connection failure',
      );
    });

    // 4. Позитивний з граничними значеннями: Порожній або опціональний content (null/undefined)
    it('should save note successfully when content is optional/null', async () => {
      const dtoWithoutContent: SaveNoteDto = {
        title: 'Note without content',
        user: { id: 2 } as any,
      };
      const savedNote = new Note({
        id: 11,
        ...dtoWithoutContent,
        content: undefined,
        user: dtoWithoutContent.user as any,
      });

      vi.spyOn(Note.prototype, 'canBeCreated').mockReturnValue(true);
      repo.save.mockResolvedValue(savedNote);

      const result = await service.saveNote(dtoWithoutContent);

      expect(repo.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual(savedNote);
    });
  });
});
