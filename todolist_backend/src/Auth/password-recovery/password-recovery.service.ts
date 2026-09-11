import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { hash } from 'argon2';
import { EmailService } from '../../libs/email/email.service.js';
import { UsersService } from '../../Users/users.service.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
import { NewPasswordDto } from './dto/new-password.dto.js';
import { TokensService } from '../../Tokens/tokens.service.js';
import { TokenType } from '../../Tokens/tokens.entity.js';
import { IToken } from '../../Tokens/token.interface.js';

@Injectable()
export class PasswordRecoveryService {
  public constructor(
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
    private readonly tokensService: TokensService,
  ) {}

  public async resetPassword(dto: ResetPasswordDto): Promise<boolean> {
    const existingClient = await this.usersService.findByEmail(dto.email);

    if (!existingClient) {
      throw new NotFoundException(
        'client doesn`t found. Please, check corrects input token or request new ',
      );
    }

    const passwordResetToken = await this.generatePasswordResetToken(
      existingClient.email,
    );
    await this.emailService.sendPasswordResetEmail(
      passwordResetToken.email,
      passwordResetToken.token,
    );

    return true;
  }

  public async newPassword(
    dto: NewPasswordDto,
    token: string,
  ): Promise<boolean> {
    let existingToken = await this.tokensService.findTokenByTypeAndToken(
      token,
      TokenType.PASSWORD_RESET,
    );
    if (!existingToken) {
      throw new NotFoundException(
        'Token doesn`t found. Please, check corrects input token or request new ',
      );
    }

    const hasExpired = new Date(existingToken.expiresIn) < new Date();

    if (hasExpired) {
      throw new BadRequestException(
        'Verified token ended. Please , request new token for confirmation reset password  ',
      );
    }

    const existingUser = await this.usersService.findByEmail(
      existingToken.email,
    );
    if (!existingUser) {
      throw new NotFoundException(
        'Client doesn`t found. Please , check introduced email and try again',
      );
    }

    await this.usersService.updateUser(existingUser.id, {
      password: await hash(dto.password),
    });

    await this.tokensService.deleteToken(
      existingToken.id,
      TokenType.PASSWORD_RESET,
    );

    return true;
  }

  private async generatePasswordResetToken(email: string): Promise<IToken> {
    const token = uuidv4();
    const expiresIn = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await this.tokensService.findTokenByTypeAndEmail(
      email,
      TokenType.PASSWORD_RESET,
    );

    if (existingToken) {
      await this.tokensService.deleteToken(
        existingToken.id,
        TokenType.PASSWORD_RESET,
      );
    }

    const passwordResetToken = await this.tokensService.createToken(
      email,
      token,
      expiresIn,
      TokenType.PASSWORD_RESET,
    );

    return passwordResetToken;
  }
}
