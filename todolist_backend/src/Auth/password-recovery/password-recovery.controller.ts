import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PasswordRecoveryService } from './password-recovery.service.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
import { NewPasswordDto } from './dto/new-password.dto.js';

@ApiTags('Password Recovery')
@Controller('password-recovery')
export class PasswordRecoveryController {
  constructor(
    private readonly passwordRecoveryService: PasswordRecoveryService,
  ) {}

  @Post('v1/reset-password')
  public async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.passwordRecoveryService.resetPassword(dto);
  }

  @Post('v1/new/:token')
  public async newPassword(
    @Body() dto: NewPasswordDto,
    @Param('token') token: string,
  ) {
    return this.passwordRecoveryService.newPassword(dto, token);
  }
}
