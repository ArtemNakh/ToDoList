import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import { redisSessionConfig } from '../config/redisSession.config.js';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.use(redisSessionConfig(configService));
  
  const configSwagger = new DocumentBuilder()
    .setTitle('TodoList API')
    .setDescription('API для керування завданнями та нотатками')
    .setVersion('1.0')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, configSwagger);
  const endDocsApi = '/api';

  const port = configService.get<number>('APPLICATION_PORT') ?? 3000;

  SwaggerModule.setup(endDocsApi, app, documentFactory);
  await app.listen(port);
  console.log(`🚀 Server is running on http://localhost:${port} 
    \n Docs api: http://localhost:${port}${endDocsApi}
    `);
}
await bootstrap();
