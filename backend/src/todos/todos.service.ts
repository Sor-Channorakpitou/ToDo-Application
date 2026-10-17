
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity.js';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private repo: Repository<Todo>,
  ) {}

  // Get all todos
  findAll() {
    return this.repo.find({
      order: { id: 'ASC' },
    });
  }

  // Create a todo
  create(dto: CreateTodoDto) {
    return this.repo.save(this.repo.create(dto));
  }

  // Update a todo
  async update(id: number, updateTodoDto: UpdateTodoDto) {
    const todo = await this.repo.findOne({
      where: { id },
    });

    if (!todo) {
      throw new NotFoundException(`Todo ${id} not found`);
    }

    Object.assign(todo, updateTodoDto);

    return this.repo.save(todo);
  }

  // Delete a todo
  async remove(id: number) {
    const result = await this.repo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Todo ${id} not found`);
    }

    return {
      message: `Todo ${id} deleted successfully`,
    };
  }
}
