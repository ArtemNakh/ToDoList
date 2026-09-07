import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EmailConfirmationService } from './email-confirmation.service.js';
import { TokenVerificationDto } from './dto/TokenVerification.dto.js';
import { TokenVerificationResponseDto } from './dto/TokenVerification.response.dto.js';
import { plainToInstance } from 'class-transformer';

@ApiTags('Email Confirmation')
@Controller('email-confirmation')
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Post('v1/verification')
  public async VerificationToken(
    @Body() dto: TokenVerificationDto,
  ): Promise<TokenVerificationResponseDto> {
    
    const user = await this.emailConfirmationService.newVerification(dto);
    
    return plainToInstance(TokenVerificationResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
