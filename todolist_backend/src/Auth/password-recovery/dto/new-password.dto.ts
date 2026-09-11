import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class NewPasswordDto {
  @ApiProperty({
    description: 'New user`s password. Minimal 6 symbol',
    example: 'TestPass123',
  })
  @IsString({ message: 'Password must be string' })
  @MinLength(6, { message: 'Password must contain not less 6 symbol' })
  @IsNotEmpty({ message: 'Field new password can not be empty' })
  password: string;
}
