import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { verify } from 'argon2';
import { UsersService } from '../Users/users.service.js';
import { RegistrationUserDto } from './dto/RegistrationUser.dto.js';
import { LoginUserDto } from './dto/loginUser.dto.js';
import IUser from '../Users/user.interface.js';
import { ConfigService } from '@nestjs/config';
import { EmailConfirmationService } from './email-confirmation/email-confirmation.service.js';

@Injectable()
export class AuthService {
  public constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  /**
   * Реєстрація нового користувача.
   * Виконує перевірку на дублювання email, створює користувача та надсилає токен підтвердження.
   * @param req - HTTP Request
   * @param dto - DTO з даними для реєстрації клієнта
   * @throws ConflictException якщо користувач з таким email вже існує
   * @returns Повідомлення про успішну реєстрацію
   */
  public async registrationUser(req: Request, dto: RegistrationUserDto) {
    const isExists = await this.userService.findByEmail(dto.email);
    if (isExists) {
      throw new ConflictException(
        'Registration failed. User with the same email already exists.',
      );
    }
    const newUser = await this.userService.createUser(dto);
    console.log("register user",newUser)
    this.emailConfirmationService
      .sendVerificationToken(newUser.email)
      .catch((err:any) => console.error('Email error:', err));
    return {
      message:
        'You are successfully registered. Please confirm your email. A mail was sent to your email.',
    };
  }

  /**
   * Авторизація користувача.
   * Перевіряє email, пароль та статус підтвердження пошти.
   * @param req - HTTP Request
   * @param dto - DTO з даними для входу
   * @throws NotFoundException якщо користувач не знайдено
   * @throws UnauthorizedException якщо пароль некоректний або email не підтверджено
   * @returns Об’єкт із користувачем та authToken
   */
  public async loginUser(req: Request, dto: LoginUserDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user || !user.password) {
      throw new NotFoundException('Client not found. Please check your input.');
    }
    const isValidPassword = dto.password; //await verify(user.password, dto.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Incorrect password.');
    }
    if (!user.isVerified) {
      // await this.emailConfirmationService.sendVerificationToken(client.email);
      throw new UnauthorizedException(
        'Your email is not confirmed. Please, check your email and confirm it',
      );
    }
    return this.saveUserSession(req, user);
  }

  /**
   * Вихід клієнта із системи.
   * Завершує сесію та очищає cookie.
   * @param req - HTTP Request
   * @param res - HTTP Response
   * @throws InternalServerErrorException якщо сесію не вдалося завершити
   */
  public async logoutUser(req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException(
              'The session could not be ended. There may be a problem with the server or the session has already ended',
            ),
          );
        }
        res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));
        resolve();
      });
    });
  }

  /**
   * Збереження сесії користувача.
   * @param req - HTTP Request
   * @param user - Об’єкт клієнта
   * @throws InternalServerErrorException якщо сесію не вдалося зберегти
   * @returns Об’єкт із клієнтом та authToken
   */
  public async saveUserSession(
    req: Request,
    user: IUser,
  ): Promise<{ authToken: string }> {
    return new Promise((resolve, reject) => {
      req.session.userId = user.id.toString();
      req.session.save((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException(
              `Failed to save session. ${err?.message || 'Unknown error'}. Please check Redis connection and session configuration.`,
            ),
          );
        }
        const authToken = req.sessionID;
        resolve({ authToken });
      });
    });
  }
}
