import INote from '../Notes/note.interface.js';

 interface IUser {
  id: number;
  name: string;
  surname: string;
  email: string;
  password: string;
  notes: INote[];
  created_at: Date;
  updated_at: Date;
}

export default IUser;
