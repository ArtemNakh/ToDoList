import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { RegistrationUserDto } from './dto/RegistrationUser.dto.js';
import { RegistrationUserResponseDto } from './dto/response/RegistrationClient.response.dto.js';
import { LoginUserDto } from './dto/loginUser.dto.js';
import { LoginUserResponseDto } from './dto/response/LoginClient.response.dto.js';
import type { Request,Response } from 'express';
import { plainToInstance } from 'class-transformer';

@ApiTags('Auth')
@Controller('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('v1/registration')
  public async registerClient(
    @Req() req: Request,
    @Body() dto: RegistrationUserDto,
  ): Promise<RegistrationUserResponseDto> {
    return this.authService.registrationUser(req, dto);
  }

  @Post('v1/login')
  public async login(
    @Req() req: Request,
    @Body() dto: LoginUserDto,
  ): Promise<LoginUserResponseDto> {
    const authClient = await this.authService.loginUser(req, dto);
    return plainToInstance(LoginUserResponseDto, authClient, {
      excludeExtraneousValues: true,
    });
  }

    @Post('v1/logout')
     public async logout(
      @Req() req: Request,
      @Res({ passthrough: true }) res: Response,
    ) {
      return this.authService.logoutUser(req, res);
    }
}
