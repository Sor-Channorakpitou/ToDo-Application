import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import type { Relation } from 'typeorm';
import { Todo } from '../../todos/entities/todo.entity.js';
import { RefreshToken } from '../../auth/entities/refresh-token.entity.js';
import { Role } from './role.enum.js';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @OneToMany(() => Todo, (todo) => todo.owner)
  todos: Relation<Todo[]>;

  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshTokens: Relation<RefreshToken[]>;
}

export { Role };
