import { Module } from '@nestjs/common';
import { UsersService } from '../../Users/users.service.js';
import { PasswordRecoveryService } from './password-recovery.service.js';
import { EmailService } from '../../libs/email/email.service.js';
import { PasswordRecoveryController } from './password-recovery.controller.js';
import { TokensService } from '../../Tokens/tokens.service.js';
import { UsersModule } from '../../Users/users.module.js';
import { TokensModule } from '../../Tokens/tokens.module.js';

@Module({
  imports: [UsersModule,TokensModule],
  controllers: [PasswordRecoveryController],
  providers: [PasswordRecoveryService,  EmailService],
})
export class PasswordRecoveryModule {}
