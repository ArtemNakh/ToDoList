import { UserRelationDto } from '../../../Users/User.dto.js';

export class SaveNoteDto {
  title: string;
  content?: string;
  user: UserRelationDto;
}
