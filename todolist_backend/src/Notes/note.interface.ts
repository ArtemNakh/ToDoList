import IUser from '../Users/user.interface.js';

interface INote {
  id: number;
  title: string;
  content?: string;
  user: IUser;
  created_at: Date;
  updated_at: Date;

  isValid(): boolean;
  canBeCreated(): boolean;
}

export default INote;
