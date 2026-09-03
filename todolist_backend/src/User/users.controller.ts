import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { User } from './user.entity.js';

@Controller('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
}
