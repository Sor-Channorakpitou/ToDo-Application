import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity.js';
import { Todo } from './todos/entities/todo.entity.js';
import { RefreshToken } from './auth/entities/refresh-token.entity.js';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,

  entities: [User, Todo, RefreshToken],
  migrations: ['src/migrations/*.ts'],

  synchronize: false,
});