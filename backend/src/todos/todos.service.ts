import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity.js';
import type { AuthUser } from '../auth/auth.types.js';
import { Role } from '../users/entities/role.enum.js';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private repo: Repository<Todo>,
  ) {}

  // Get todos: filtered strictly by ownerId: user.id
  findAll(user: AuthUser) {
    if (user.role === Role.ADMIN) {
      return this.repo.find({
        order: { id: 'ASC' },
        relations: { owner: true },
      });
    }

    return this.repo.find({
      where: { ownerId: user.id },
      order: { id: 'ASC' },
    });
  }

  // Get a single todo with ownership verification
  async findOne(id: number, user: AuthUser) {
    const todo = await this.repo.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (!todo) {
      throw new NotFoundException(`Todo #${id} not found`);
    }

    if (user.role !== Role.ADMIN && todo.ownerId !== user.id) {
      throw new ForbiddenException('You do not have access to this todo');
    }

    return todo;
  }

  // Create a todo: ownerId set exclusively from authenticated user
  create(dto: CreateTodoDto, user: AuthUser) {
    const todo = this.repo.create({
      title: dto.title,
      status: dto.status ?? 'TODO',
      ownerId: user.id,
    });
    return this.repo.save(todo);
  }

  // Update a todo: verify ownership before updating
  async update(id: number, updateTodoDto: UpdateTodoDto, user: AuthUser) {
    const todo = await this.findOne(id, user);

    if (updateTodoDto.title !== undefined) {
      todo.title = updateTodoDto.title;
    }
    if (updateTodoDto.status !== undefined) {
      todo.status = updateTodoDto.status;
    }

    return this.repo.save(todo);
  }

  // Delete a todo: verify ownership before deleting
  async remove(id: number, user: AuthUser) {
    await this.findOne(id, user);
    await this.repo.delete(id);
    return {
      message: `Todo ${id} deleted successfully`,
    };
  }
}
