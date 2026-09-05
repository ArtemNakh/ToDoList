import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service.js';
import IUser from './user.interface.js';

@Controller('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('v1')
  async findAll(): Promise<IUser[]> {
    return this.usersService.findAll();
  }
}
