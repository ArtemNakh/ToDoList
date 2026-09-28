import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateNoteBodyDto {
  @ApiProperty({ example: 'Shop list', description: 'Note title' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: 'Tomato, potato, bread',
    description: 'Note content',
  })
  @IsString()
  @IsOptional()
  content?: string;
}
