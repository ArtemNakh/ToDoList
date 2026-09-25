import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { UserRelationDto } from '../../../Users/User.dto.js';

export class SaveNoteDto {
  @ApiProperty({ example: 'Shop list', description: 'Note title' })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Tomato, potato, bread',
    description: 'Note content',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ description: 'User description' })
  @ValidateNested()
  @Type(() => UserRelationDto)
  @IsNotEmpty({ message: 'User object must be' })
  user: UserRelationDto;
}
