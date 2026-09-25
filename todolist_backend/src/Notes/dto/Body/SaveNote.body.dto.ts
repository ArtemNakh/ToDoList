import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class SaveNoteBodyDto {
  @ApiProperty({ example: 'Shop list', description: 'Note title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Tomato, potato, bread',
    description: 'Note content',
  })
  @IsString()
  @IsOptional()
  content?: string;
}
