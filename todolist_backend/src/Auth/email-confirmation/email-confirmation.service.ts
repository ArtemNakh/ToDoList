import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TokenType } from '../../Tokens/tokens.entity.js';
import { TokenVerificationDto } from './dto/TokenVerification.dto.js';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from '../../Users/users.service.js';
import { EmailService } from '../../libs/email/email.service.js';
import { TokensService } from '../../Tokens/tokens.service.js';
import { IToken } from '../../Tokens/token.interface.js';

@Injectable()
export class EmailConfirmationService {
  public constructor(
    private readonly mailService: EmailService,
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
  ) {}

  public async newVerification(dto: TokenVerificationDto) {
    const existingToken = await this.tokensService.findTokenByTypeAndToken(
      dto.token,
      TokenType.VERIFICATION,
    );

    if (!existingToken) {
      throw new NotFoundException(
        'Verification token didn`t found. Please sure, that you have got correct token  ',
      );
    }

    const hasExpired = new Date(existingToken.expiresIn) < new Date();

    if (hasExpired) {
      throw new BadRequestException(
        'Verification token ended. Please ,request new token for confirmation',
      );
    }

    const existingUser = await this.usersService.findByEmail(
      existingToken.email,
    );

    if (!existingUser) {
      throw new NotFoundException(
        'Client with specified email didn`t found. Please ,sure , that you enter correct email',
      );
    }

    await this.usersService.updateUser(existingUser.id, { isVerified: true });
    await this.tokensService.deletedToken(
      existingToken.id,
      TokenType.VERIFICATION,
    );
  }

  public async sendVerificationToken(email: string) {
    const verificationToken = await this.generateVerificationToken(email);

    await this.mailService.sendConfirmationEmail(
      verificationToken.email,
      verificationToken.token,
    );
    return true;
  }

  private async generateVerificationToken(email: string): Promise<IToken> {
    const token = uuidv4();
    const expireIn = new Date(new Date().getTime() + 3600 * 1000);

    let existingToken: IToken | null = null;

    try {
      existingToken = await this.tokensService.findTokenByTypeAndEmail(
        email,
        TokenType.VERIFICATION,
      );
    } catch (error) {
      existingToken = null;
    }

    if (existingToken) {
      await this.tokensService.deletedToken(
        existingToken.id,
        TokenType.VERIFICATION,
      );
    }

    const verificationToken = await this.tokensService.createToken(
      email,
      token,
      expireIn,
      TokenType.VERIFICATION,
    );

    return verificationToken;
  }
}
