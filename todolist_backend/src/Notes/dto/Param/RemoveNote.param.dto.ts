import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class RemoveNoteDto {
  @ApiProperty({ example: 1, description: 'Unique Note identity for removal' })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  noteId: number;
}
