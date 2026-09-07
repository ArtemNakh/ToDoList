import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TokenVerificationDto {
  @ApiProperty({
    description: 'Verification token, that user will getting on email',
    example: '4277349b-1e9b-4adf-bf23-c934fe55c356',
  })
  @IsString({ message: 'Token must be string' })
  @IsNotEmpty({ message: 'Field token can not be empty' })
  token: string;
}
