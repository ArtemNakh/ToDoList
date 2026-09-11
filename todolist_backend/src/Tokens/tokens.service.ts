import { InjectRepository } from '@nestjs/typeorm';
import { Token, TokenType } from './tokens.entity.js';
import { Repository } from 'typeorm';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { IToken } from './token.interface.js';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Token)
    private tokenRepo: Repository<Token>,
  ) {}

  /**
   * Видалити токен підтвердження за його ID та типом.
   * @param tokenId - унікальний ідентифікатор токена
   * @param type - тип токена (наприклад, VERIFICATION)
   * @throws InternalServerErrorException якщо видалення не вдалося
   */
  public async deleteToken(
    tokenId: number,
    typeToken: TokenType,
  ): Promise<void> {
    try {
      await this.tokenRepo.delete({ id: tokenId, type: typeToken });
    } catch (err: any) {
      throw new InternalServerErrorException(
        `Failed to delete token. id token:${tokenId} type token:${typeToken} - ${err?.message || 'Unknown error'}`,
      );
    }
  }

  /**
   * Знайти токен підтвердження за email та типом.
   * @param email - email користувача
   * @param type - тип токена (наприклад, VERIFICATION)
   * @returns Токен, якщо знайдено
   * @throws NotFoundException якщо токен не знайдено
   * @throws InternalServerErrorException якщо сталася технічна помилка
   */
  public async findTokenByTypeAndEmail(
    email: string,
    type: TokenType,
  ): Promise<Token> {
    try {
      const token = await this.tokenRepo.findOne({
        where: { email, type },
      });

      if (!token) {
        throw new NotFoundException(
          `Token with type ${type} for email ${email} not found`,
        );
      }

      return token;
    } catch (err: any) {
      throw new InternalServerErrorException(
        `Failed to find token for email ${email}, type ${type}. ${err?.message || 'Unknown error'}`,
      );
    }
  }

   /**
   * Знайти токен підтвердження за токеном та типом.
   * @param token - токен користувача
   * @param type - тип токена (наприклад, VERIFICATION)
   * @returns Токен, якщо знайдено
   * @throws NotFoundException якщо токен не знайдено
   * @throws InternalServerErrorException якщо сталася технічна помилка
   */
  public async findTokenByTypeAndToken(
    token: string,
    type: TokenType,
  ): Promise<Token> {
    try {
      const existToken = await this.tokenRepo.findOne({
        where: {  token, type },
      });

      if (!existToken) {
        throw new NotFoundException(
          `Token with type ${type} for email ${existToken} not found`,
        );
      }

      return existToken;
    } catch (err: any) {
      throw new InternalServerErrorException(
        `Failed to find token for email ${token}, type ${type}. ${err?.message || 'Unknown error'}`,
      );
    }
  }


  /**
 * Створити новий токен підтвердження.
 * @param email - email користувача
 * @param token - значення токена
 * @param expireIn - дата/час закінчення дії токена
 * @param type - тип токена (наприклад, VERIFICATION)
 * @returns Створений токен
 * @throws InternalServerErrorException якщо токен не вдалося зберегти
 */
public async createToken(
  email: string,
  token: string,
  expireIn: Date,
  type: TokenType = TokenType.VERIFICATION,
): Promise<IToken> {
  
  try {
    
    const verificationToken = this.tokenRepo.create({
      email,
      token,
      expiresIn: expireIn,
      type,
    });
    
    return await this.tokenRepo.save(verificationToken);
  } catch (err: any) {
    throw new InternalServerErrorException(
      `Failed to create verification token for ${email}. ${err?.message || 'Unknown error'}`,
    );
  }
}

}
