import { ApiProperty } from '@nestjs/swagger';

export class RegistrationUserResponseDto {
  @ApiProperty({
    description: 'Повідомлення про успішну реєстрацію та необхідність підтвердження email',
    example:
      'You are successfully registered. Please confirm your email. A mail was sent to your email.',
  })
  message: string;
}
