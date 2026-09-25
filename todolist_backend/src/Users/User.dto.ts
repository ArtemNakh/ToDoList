import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UserRelationDto {
  @ApiProperty({
    description: 'Unique user identify',
    example: 1,
  })
  @IsNumber({}, { message: 'user id must be number ' })
  @IsNotEmpty({ message: 'user id must be' })
  id: number;
}
