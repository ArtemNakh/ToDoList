import * as argon2 from 'argon2';

export class HashService {
  /**
   * Генерує хеш для переданого значення.
   *
   * @param value Дані для хешування.
   * @returns Згенерований хеш.
   */
  static async hash(value: string): Promise<string> {
    return argon2.hash(value);
  }
  
  /**
   * Перевіряє відповідність відкритого пароля його хешу.
   *
   * Використовує Argon2 для безпечного порівняння пароля користувача
   * зі збереженим у базі даних хешем.
   *
   * @param hashPassword Хешований пароль з бази даних.
   * @param plainPassword Пароль, введений користувачем.
   * @returns Promise<boolean>:
   * - true, якщо пароль збігається з хешем;
   * - false, якщо пароль не збігається.
   */
  static async comparePassword(
    hashPassword: string,
    plainPassword: string,
  ): Promise<boolean> {
    return argon2.verify(hashPassword, plainPassword);
  }
}
