
import IUser from '../Users/user.interface.js';

interface INote {
  id: number;
  title: string;
  content?: string;
  user: IUser;
  created_at: Date;
  updated_at: Date;
}

export default INote;
