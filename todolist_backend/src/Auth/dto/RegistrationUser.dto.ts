import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'PasswordMatch', async: false })
class PasswordMatchConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const object = args.object as RegistrationUserDto;
    return value === object.password;
  }
  defaultMessage(args: ValidationArguments) {
    return 'Passwords do not match';
  }
}

export class RegistrationUserDto {
  @ApiProperty({ description: 'Client`s name', example: 'Ivan' })
  @IsString({ message: 'Name must be string' })
  @IsNotEmpty({ message: 'Name must be filling' })
  name: string;

  @ApiProperty({ description: 'user surname', example: 'Doe' })
  @IsString({ message: 'User must be string' })
  @IsNotEmpty({ message: 'User must be filling' })
  surname: string;

  @ApiProperty({
    description: 'User’s email address',
    example: 'john.doe@example.com',
  })
  @IsString({ message: 'Email must be string' })
  @IsEmail({}, { message: 'Uncorrect format email' })
  @IsNotEmpty({ message: 'Email must be filling' })
  email: string;

  @ApiProperty({
    description: 'Password (minimum 6 characters)',
    example: 'StrongPass123',
  })
  @IsString({ message: 'Password must be string' })
  @IsNotEmpty({ message: 'Password must be filling' })
  @MinLength(6, {
    message: 'Password must containt minimal 6 letter',
  })
  password: string;

  @ApiProperty({
    description: 'Password confirmation',
    example: 'StrongPass123',
  })
  @IsString({ message: 'Password verification must be string' })
  @IsNotEmpty({ message: 'Password verification must be filling' })
  @MinLength(6, {
    message: 'Password verification must containt minimal 6 letter',
  })
  @Validate(PasswordMatchConstraint)
  passwordRepeat: string;
}
