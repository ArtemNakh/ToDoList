import { DataSource } from 'typeorm';
import { User } from '../src/Users/user.entity.js';
import { faker } from '@faker-js/faker';
import { hash } from 'argon2';
import { writeFileSync } from 'fs';
import path from 'path';

export async function fillingUser(dataSource: DataSource, numbersUser: number) {
  const repo = dataSource.getRepository(User);
  const users: User[] = [];
  const credentials: { email: string; password: string }[] = []; 
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
    credentials.push({ email: user.email, password: plainPassword }); 
    users.push(user);
  }

  await repo.save(users);
  const filePath = path.join(process.cwd(), 'seeds', 'users.json');
  writeFileSync(filePath, JSON.stringify(credentials, null, 2), 'utf-8');

  console.log(`✅ Saved ${users.length} users`);
  console.log(`📂 Credentials saved to ${filePath}`);
}