import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'user`s email for recovery password',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Enter correct email' })
  @IsNotEmpty({ message: 'Field email can not be empty' })
  email: string;
}
