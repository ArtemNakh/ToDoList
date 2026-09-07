import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: 'Ім’я користувача', example: 'Ivan', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Прізвище користувача', example: 'Doe', required: false })
  @IsOptional()
  @IsString()
  surname?: string;

  @ApiProperty({ description: 'Електронна пошта користувача', example: 'john.doe@example.com', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    description: 'Пароль користувача (мінімум 6 символів)',
    example: 'StrongPass123',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must contain at least 6 characters' })
  password?: string;

  @ApiProperty({
    description: 'Статус верифікації користувача',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isVerified must be a boolean value' })
  isVerified?: boolean;
}
