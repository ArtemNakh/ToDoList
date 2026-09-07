import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Ім’я користувача', example: 'Ivan' })
  @IsString({ message: 'Name must be string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({ description: 'Прізвище користувача', example: 'Doe' })
  @IsString({ message: 'Surname must be string' })
  @IsNotEmpty({ message: 'Surname is required' })
  surname: string;

  @ApiProperty({
    description: 'Електронна пошта користувача',
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'Пароль користувача (мінімум 6 символів)',
    example: 'StrongPass123',
  })
  @IsString({ message: 'Password must be string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must contain at least 6 characters' })
  password: string;
}
