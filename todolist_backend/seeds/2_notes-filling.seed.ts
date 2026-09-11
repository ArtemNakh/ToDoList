import { DataSource } from 'typeorm';
import { User } from '../src/Users/user.entity.js';
import IUser from '../src/Users/user.interface.js';
import { faker } from '@faker-js/faker';
import Note from '../src/Notes/note.entity.js';

export async function fillingNotes(
  dataSource: DataSource,
  minNotes: number = 0,
  maxNotes: number = 50,
) {
  const usersRepo = dataSource.getRepository(User);
  const notesRepo = dataSource.getRepository(Note);

  const users: IUser[] = await usersRepo.find();

  const notes: Note[] = [];

  for (const user of users) {
    const countNotes = faker.number.int({ min: minNotes, max: maxNotes });
    for (let i = 0; i < countNotes; i++) {
      notes.push(
        notesRepo.create({
          title: faker.lorem.word({ length: { min: 3, max: 7 } }),
          content: faker.lorem.sentences(faker.number.int({ min: 1, max: 5 })),
          user,
        }),
      );
    }
  }

  await notesRepo.save(notes);
  console.log(`Saved ${notes.length} notes`);
}
