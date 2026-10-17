import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpCode } from '@nestjs/common';
import { TodosService } from './todos.service.js';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  findAll() {
    return this.todosService.findAll();
  }

  @Post()
  create(@Body() dto: CreateTodoDto) {
    return this.todosService.create(dto);          // 201 by default
  }

  //Update user by id
  @Patch(":id")
    update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateTodoDto) {
      return this.todosService.update(id, dto);
    }

  // Delete user by id
  @Delete(":id")
    @HttpCode(204)
    remove(@Param("id", ParseIntPipe) id: number) {
      return this.todosService.remove(id);
    }
}
