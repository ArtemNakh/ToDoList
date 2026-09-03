import { DataSource } from 'typeorm';
import 'dotenv/config';
const AppDBSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['migrations/*.ts'],
});

export default AppDBSource;
//npm run migration:generate
//npm run migration:run
//npm run migration:revert
