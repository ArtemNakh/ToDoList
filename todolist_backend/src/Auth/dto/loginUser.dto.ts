import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'Client`s email  for login',
    example: 'user@example.com',
  })
  @IsString({ message: 'Email must be string' })
  @IsEmail({}, { message: 'Uncorrect format email' })
  @IsNotEmpty({ message: 'Email must be filling' })
  email: string;

  @ApiProperty({
    description: 'Client`s password (minimal 6 symbol)',
    example: 'testPass123',
  })
  @IsString({ message: 'Password must be string' })
  @IsNotEmpty({ message: 'Password must be filling' })
  @MinLength(6, {
    message: 'Password must containt minimal 6 letter',
  })
  password: string;
}
