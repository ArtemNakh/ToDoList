import { ApiProperty } from '@nestjs/swagger';

export class TokenVerificationResponseDto {
  @ApiProperty({
    description: 'JWT токен, який видається після успішної верифікації користувача',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  authToken: string;
}
