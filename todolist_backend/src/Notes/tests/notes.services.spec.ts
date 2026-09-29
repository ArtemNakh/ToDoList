import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  vi,
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  Mocked,
} from 'vitest';
import Note from '../note.entity.js';
import { SaveNoteDto } from '../dto/Services/SaveNote.service.dto.js';
import { NotesService } from '../notes.services.js';
import { UpdateNoteDto } from '../dto/Services/UpdateNote.service.dto.js';
import INote from '../note.interface.js';
import { title } from 'process';

describe('NotesService', () => {
  let service: NotesService;
  let notesRepo: Mocked<Repository<Note>>;

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
            findOne: vi.fn(),
            remove: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
    notesRepo = module.get(getRepositoryToken(Note));
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
      notesRepo.save.mockResolvedValue(savedNote);

      const result = await service.saveNote(validDto);

      expect(notesRepo.save).toHaveBeenCalledWith(
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
      expect(notesRepo.save).not.toHaveBeenCalled();
    });

    // 3. Негативний: Помилка збереження в базі даних (наприклад, збій БД або унікальний ключ)
    it('should propagate database exception when repo.save fails', async () => {
      vi.spyOn(Note.prototype, 'canBeCreated').mockReturnValue(true);
      notesRepo.save.mockRejectedValue(
        new Error('Database connection failure'),
      );

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
      notesRepo.save.mockResolvedValue(savedNote);

      const result = await service.saveNote(dtoWithoutContent);

      expect(notesRepo.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual(savedNote);
    });
  });

  describe('updateNote', () => {
    afterEach(() => {
      vi.resetAllMocks();
    });

    it('should successfully update content and title note', async () => {
      // Arrange (Підготовка)
      // 1. Вхідні дані, які нібито передав користувач через API
      const updateNoteDto: UpdateNoteDto = {
        noteId: 1,
        userId: 1,
        content: 'Eggs',
        title: 'Cake recept',
      };
      // 2. Фейкова нотатка, яка нібито вже є в базі даних
      const existingNote = {
        id: 1,
        title: 'testTitle',
        content: 'testcontent',
        user: { id: 1 },
      };

      // 3. Вказуємо моку, ЩО відповідати, коли сервіс викликає findOne
      notesRepo.findOne.mockResolvedValue(existingNote as any);

      // 4. Вказуємо моку, ЩО відповідати при виклику save (повертаємо те, що передали)
      notesRepo.save.mockImplementation(async (note) => note as any);

      //Act (Виконання)
      const result = await service.updateNote(updateNoteDto);

      //Assert (Перевірка результатів)
      // 1. Чи зробив сервіс правильний запит до "БД" (моку)?
      expect(notesRepo.findOne).toHaveBeenCalledWith({
        where: { id: updateNoteDto.noteId, user: { id: updateNoteDto.userId } },relations: { user: true },
      });

      // 2. Чи змінилися поля у повернутому результаті?
      expect(result.title).toBe('Cake recept');
      expect(result.content).toBe('Eggs');

      // 3. Чи викликав сервіс метод save() з оновленими даними?
      expect(notesRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          title: 'Cake recept',
          content: 'Eggs',
        }),
      );
    });

    it('should successfully update only title note', async () => {
      // Arrange (Підготовка)
      // 1. Вхідні дані, які нібито передав користувач через API
      const updateNoteDto: UpdateNoteDto = {
        noteId: 1,
        userId: 1,
        title: 'Cake recept',
      };
      // 2. Фейкова нотатка, яка нібито вже є в базі даних
      const existingNote = {
        id: 1,
        title: 'testTitle',
        content: 'testContent',
        user: { id: 1 },
      };

      // 3. Вказуємо моку, ЩО відповідати, коли сервіс викликає findOne
      notesRepo.findOne.mockResolvedValue(existingNote as any);

      // 4. Вказуємо моку, ЩО відповідати при виклику save (повертаємо те, що передали)
      notesRepo.save.mockImplementation(async (note) => note as any);

      //Act (Виконання)
      const result = await service.updateNote(updateNoteDto);

      //Assert (Перевірка результатів)
      // 1. Чи зробив сервіс правильний запит до "БД" (моку)?
      expect(notesRepo.findOne).toHaveBeenCalledWith({
        where: { id: updateNoteDto.noteId, user: { id: updateNoteDto.userId } },relations: { user: true },
      });

      // 2. Чи змінилися поля у повернутому результаті?
      expect(result.title).toBe('Cake recept');
      expect(result.content).toBe('testContent');

      // 3. Чи викликав сервіс метод save() з оновленими даними?
      expect(notesRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          title: 'Cake recept',
          content: 'testContent',
        }),
      );
    });

    it('should successfully update only content note', async () => {
      // Arrange (Підготовка)
      // 1. Вхідні дані, які нібито передав користувач через API
      const updateNoteDto: UpdateNoteDto = {
        noteId: 1,
        userId: 1,
        content: 'newContent',
      };
      // 2. Фейкова нотатка, яка нібито вже є в базі даних
      const existingNote = {
        id: 1,
        title: 'oldTitle',
        content: 'oldTitle',
        user: { id: 1 },
      };

      // 3. Вказуємо моку, ЩО відповідати, коли сервіс викликає findOne
      notesRepo.findOne.mockResolvedValue(existingNote as any);

      // 4. Вказуємо моку, ЩО відповідати при виклику save (повертаємо те, що передали)
      notesRepo.save.mockImplementation(async (note) => note as any);

      //Act (Виконання)
      const result = await service.updateNote(updateNoteDto);

      //Assert (Перевірка результатів)
      // 1. Чи зробив сервіс правильний запит до "БД" (моку)?
      expect(notesRepo.findOne).toHaveBeenCalledWith({
        where: { id: updateNoteDto.noteId, user: { id: updateNoteDto.userId } },relations: { user: true },
      });

      // 2. Чи змінилися поля у повернутому результаті?
      expect(result.title).toBe('oldTitle');
      expect(result.content).toBe('newContent');

      // 3. Чи викликав сервіс метод save() з оновленими даними?
      expect(notesRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          title: 'oldTitle',
          content: 'newContent',
        }),
      );
    });

    it('Don`t should change values when dto havn`t new content and title ', async () => {
      //Arrange
      const updateNoteDto: UpdateNoteDto = {
        noteId: 1,
        userId: 1,
      };
      const existingNote = {
        id: 1,
        title: 'oldTitle',
        content: 'oldContent',
        user: { id: 1 },
      };

      notesRepo.findOne.mockResolvedValue(existingNote as any);
      notesRepo.save.mockImplementation(async (note) => note as any);

      //Act
      const result = await service.updateNote(updateNoteDto);

      //Assert
      expect(result.title).toBe('oldTitle');
      expect(result.content).toBe('oldContent');
      expect(notesRepo.save).toHaveBeenCalledWith(existingNote);
    });

    it('NotFoundException if user doesn`t have note with specified id', async () => {
      //Arrange
      const updateNoteDto: UpdateNoteDto = {
        noteId: 1,
        userId: 1,
        title: 'Some Title',
      };

      notesRepo.findOne.mockResolvedValue(null);

      //Act

      //Assert
      await expect(service.updateNote(updateNoteDto)).rejects.toThrow(
        NotFoundException,
      );

      expect(notesRepo.save).not.toHaveBeenCalled();
    });

    it('Don`t save empty values("")', async () => {
      //Arrange
      const updateNoteDto: UpdateNoteDto = {
        noteId: 1,
        userId: 1,
      };
      const existingNote = {
        id: 1,
        title: 'oldTitle',
        content: 'oldContent',
        user: { id: 1 },
      };

      notesRepo.findOne.mockResolvedValue(existingNote as any);
      notesRepo.save.mockImplementation(async (note) => note as any);

      //Act
      const result = await service.updateNote(updateNoteDto);

      //Assert
      expect(result.title).toBe('oldTitle');
      expect(result.content).toBe('oldContent');
      expect(notesRepo.save).toHaveBeenCalledWith(existingNote);
    });

    it('Don`t save if error in database', async () => {
      //Arrange
      const updateNoteDto: UpdateNoteDto = {
        noteId: 1,
        userId: 1,
        title: 'Some Title',
        content: 'Some Content',
      };
      const existingNote = {
        id: 1,
        title: 'oldTitle',
        content: 'oldContent',
        user: { id: 1 },
      } as any;

      notesRepo.findOne.mockResolvedValue(existingNote);
      notesRepo.save.mockRejectedValue(new Error('Database connection error'));

      //Act

      //Assert
      await expect(service.updateNote(updateNoteDto)).rejects.toThrow(
        'Database connection error',
      );
    });
  });

  describe('GetNotesByUserId', () => {
    it('should return an array of notes for a valid userId', async () => {
      const userId = 2;
      const expectedNotes = [mockNote];

      // Мокаємо успішне повернення масиву з репозиторію
      notesRepo.find.mockResolvedValue(expectedNotes);

      const result = await service.GetNotesByUserId(userId);

      // Перевіряємо, що репозиторій викликано з правильними параметрами
      expect(notesRepo.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
      });
      expect(notesRepo.find).toHaveBeenCalledTimes(1);

      // Перевіряємо результат виконання методу
      expect(result).toEqual(expectedNotes);
    });

    it('should throw BadRequestException if userId is missing or falsy (e.g., 0, null, undefined)', async () => {
      const invalidUserId = 0; // 0 є falsy-значенням для перевірки `if (!userId)`

      // Перевіряємо, що викликається BadRequestException з відповідним повідомленням
      await expect(service.GetNotesByUserId(invalidUserId)).rejects.toThrow(
        new BadRequestException('UserId must be'),
      );

      // Репозиторій не повинен викликатися, якщо валідація не пройшла
      expect(notesRepo.find).not.toHaveBeenCalled();
    });
  });
});
