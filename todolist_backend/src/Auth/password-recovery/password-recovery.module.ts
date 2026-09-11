import { Module } from '@nestjs/common';
import { UsersService } from '../../Users/users.service.js';
import { PasswordRecoveryService } from './password-recovery.service.js';
import { EmailService } from '../../libs/email/email.service.js';
import { PasswordRecoveryController } from './password-recovery.controller.js';
import { TokensService } from '../../Tokens/tokens.service.js';

@Module({
  imports: [],
  controllers: [PasswordRecoveryController],
  providers: [PasswordRecoveryService, UsersService, EmailService,TokensService],
})
export class PasswordRecoveryModule {}
