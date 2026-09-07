import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service.js';
import { Token } from './tokens.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Token])],
  controllers: [],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
