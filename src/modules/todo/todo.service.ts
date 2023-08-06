import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { TodoResponseDto } from './dto/todo-response.dto';
import { IPaginationQuery } from './interface/todo.interface';
import { TodoResponseListDto } from './dto/todo-response-list.dto';

@Injectable()
export class TodoService {

  constructor(
    @InjectRepository(Todo) private readonly todoRepository: Repository<Todo>
    ){}


  public async create(createTodoDto: CreateTodoDto): Promise<TodoResponseDto> {
    const newTodo = this.todoRepository.create(createTodoDto);
    return await this.todoRepository.save(newTodo);
  }

  public async findAll(paginationQuery: IPaginationQuery): Promise<TodoResponseListDto> {
    const todos = await this.todoRepository.findAndCount({
      order: { created_at : paginationQuery.order} as FindOptionsOrder<Todo>,
      take: paginationQuery.limit,
      skip: paginationQuery.skip
    })
    return {todos: todos[0], count: todos[1]};
  }

  public async findOne(id: string): Promise<TodoResponseDto> {
    let todo = await this.todoRepository.findOne({ where: { 
      id: id 
    } as FindOptionsWhere<any> });

    if(!todo) throw new NotFoundException(`Todo width ${id} not found`);

    return todo;
  }

  public async update(id: string, updateTodoDto: UpdateTodoDto): Promise<TodoResponseDto> {
    let todo = await this.todoRepository.findOne({ where: { 
      id: id 
    } as FindOptionsWhere<any> });

    if(!todo) throw new NotFoundException(`Todo width ${id} not found`);

    let updatedTodo = {...todo, ...updateTodoDto}
    return await this.todoRepository.save(updatedTodo);
  }

  public async remove(id: string): Promise<TodoResponseDto> {
    let todo = await this.todoRepository.findOne({ where: { 
      id: id 
    } as FindOptionsWhere<any> });

    if(!todo) throw new NotFoundException(`Todo width ${id} not found`);
    return await this.todoRepository.remove(todo);
  }
}
