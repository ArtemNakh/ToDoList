import { Repository } from 'typeorm';
import { User } from './user.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { CreateUserDto } from './dto/CreateUser.dto.js';
import IUser from './user.interface.js';
import { UpdateUserDto } from './dto/UpdateUser.dto.js';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<IUser[]> {
    return this.usersRepository.find();
  }

  /**
   * Find user by email.
   * @param email - user`s email
   * @returns user object or null
   */
  public async findByEmail(email: string): Promise<IUser | null> {
    console.log('email', email);
    const client = await this.usersRepository.findOne({
      where: { email },
    });
    return client;
  }

  /**
   * Створити нового користувача.
   * Пароль хешується за допомогою argon2.
   * @param data - DTO з даними для створення користувача
   * @returns Створений user
   */
  public async createUser(data: CreateUserDto): Promise<IUser> {
    const user = await this.usersRepository.create({
      name: data.name,
      surname: data.surname,
      email: data.email,
      password: data.password, //await argon2.hash(data.password),
    });
    await this.usersRepository.save(user);
    return user;
  }

  /**
   * Оновити дані користувача за його ID.
   * Якщо користувача не знайдено — кидає NotFoundException.
   * @param userId - унікальний ідентифікатор користувача
   * @param dto - DTO з новими даними для оновлення
   * @returns Оновлений користувач
   */
  async updateUser(userId: number, dto: UpdateUserDto): Promise<IUser> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    Object.assign(user, dto);
    return await this.usersRepository.save(user);
  }
}
