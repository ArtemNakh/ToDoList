import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service.js';
import IUser from './user.interface.js';
import { User } from './user.entity.js';

@Controller('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('v1')
  async findAll(): Promise<IUser[]> {
    return this.usersService.findAll();
  }

  @Get('v1/email/:email')
  async findByEmail(@Param('email') email: string): Promise<User | null> {
   
    return this.usersService.findByEmail(email);
  }
}
