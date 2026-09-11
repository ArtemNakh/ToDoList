import { DataSource } from 'typeorm';
import { User } from '../src/Users/user.entity.js';
import { faker } from '@faker-js/faker';
import { hash } from 'argon2';

export async function fillingUser(dataSource: DataSource, numbersUser: number) {
  const repo = dataSource.getRepository(User);
  const users: User[] = [];
  for (let i = 0; i < numbersUser; i++) {
    const plainPassword = faker.internet.password({ length: 12 }); 
    const hashedPassword = await hash(plainPassword); 

    const user = repo.create({
      name: faker.person.firstName(),
      surname: faker.person.lastName(),
      email: faker.internet.email(),
      password: hashedPassword,
      isVerified: Boolean(faker.helpers.arrayElement([0, 1])),
    });

    console.log(`User ${user.email} → пароль: ${plainPassword}`);
    users.push(user);
  }

  await repo.save(users);
  console.log(`Saved ${users.length} users`);
}
