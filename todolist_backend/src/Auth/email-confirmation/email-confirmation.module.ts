import { Module } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service.js';
import { EmailConfirmationController } from './email-confirmation.controller.js';
import { EmailModule } from '../../libs/email/email.module.js';
import { TokensModule } from '../../Tokens/tokens.module.js';
import { UsersModule } from '../../Users/users.module.js';

@Module({
  imports: [EmailModule, TokensModule, UsersModule],
  controllers: [EmailConfirmationController],
  providers: [EmailConfirmationService],
  exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}
