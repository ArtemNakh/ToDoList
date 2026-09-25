import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRelationDto } from '../../../Users/User.dto.js';
import INote from '../../note.interface.js';

export class NoteResponseDto implements Omit<
  INote,
  'isValid' | 'canBeCreated' | 'user'
> {
  @ApiProperty({ example: 11, description: 'Unique code object' })
  id: number;

  @ApiProperty({ example: 'Shop list', description: 'Note title' })
  title: string;

  @ApiPropertyOptional({
    example: 'bread,milk,water',
    description: 'Note content',
    nullable: true,
  })
  content: string | undefined;

  @ApiProperty({ type: () => UserRelationDto })
  user: UserRelationDto;

  @ApiProperty({
    example: '2026-09-25T10:49:48.000Z',
    description: 'Сreation date',
  })
  created_at: Date;

  @ApiProperty({
    example: '2026-09-25T10:49:48.000Z',
    description: 'Update date',
  })
  updated_at: Date;
}
