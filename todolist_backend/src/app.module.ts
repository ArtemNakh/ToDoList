import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeOrmConfig } from '../config/typeorm.config.js';
import { UsersModule } from './Users/users.module.js';
import { TokensModule } from './Tokens/tokens.module.js';
import { NotesModule } from './Notes/notes.module.js';
import { AuthModule } from './Auth/auth.module.js';
import { EmailConfirmationModule } from './Auth/email-confirmation/email-confirmation.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    UsersModule,
    TokensModule,
    NotesModule,
    AuthModule,
    EmailConfirmationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
