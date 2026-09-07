import session from 'express-session';
import {RedisStore} from 'connect-redis';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';

export function redisSessionConfig(configService: ConfigService) {
  const redisClient = createClient({
    url: configService.getOrThrow('REDIS_URI'),
    password: configService.getOrThrow('REDIS_PASSWORD'),
  });

  redisClient.on('error', (err) => console.error('Redis Client Error', err));
  redisClient.connect().then(() => console.log('Redis connected'));

  return session({
    store: new RedisStore({
      client: redisClient,
      prefix: configService.getOrThrow<string>('SESSION_FOLDER') + ':',
    }),
    secret: configService.getOrThrow<string>('SESSION_SECRET'),
    name: configService.getOrThrow<string>('SESSION_NAME'),
    resave: false,
    saveUninitialized: false,
    cookie: {
      domain: configService.getOrThrow<string>('SESSION_DOMAIN'),
      maxAge: Number(configService.getOrThrow('SESSION_MAX_AGE')),
      httpOnly: configService.getOrThrow<string>('SESSION_HTTP_ONLY') === 'true',
      secure: configService.getOrThrow<string>('SESSION_SECURE') === 'true',
      sameSite: 'lax',
    },
  });
}
