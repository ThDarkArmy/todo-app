import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { Todo } from './entities/todo.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Status } from './enums/todo.enums';
import { NotFoundException } from '@nestjs/common';

describe('TodoService', () => {

  let todoService: TodoService;
  let todoRepository: Repository<Todo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(Todo),
          useClass: Repository,
        },
      ],
    }).compile();

    todoService = module.get<TodoService>(TodoService);
    todoRepository = module.get<Repository<Todo>>(getRepositoryToken(Todo));
  });

  it('should be defined', () => {
    expect(todoService).toBeDefined();
  });

  describe('create a todo', () => {
    it('should create a new todo', async () => {
      const createTodoDto: CreateTodoDto = {
        title: 'Test Todo',
        description: 'Test description',
        status: 'NOT_COMPLETED' as Status,
      };

      const savedTodo = {
        id: '1',
        created_at: new Date(),
        updated_at: new Date(),
        ...createTodoDto,
      };

      jest.spyOn(todoRepository, 'create').mockReturnValue(savedTodo);
      jest.spyOn(todoRepository, 'save').mockResolvedValue(savedTodo);

      const result = await todoService.create(createTodoDto);

      expect(result).toEqual(savedTodo);
    });
  });

  describe('find all todos', () => {
    it('should return a list of todos', async () => {
      const paginationQuery = {
        order: 'ASC',
        limit: 10,
        skip: 0,
      };

      const todos = [
        { id: '1', title: 'Todo 1', description: 'description 1', status: "NOT_COMPLETED", created_at: new Date(), updated_at: new Date()},
        { id: '2', title: 'Todo 2', description: 'description 2', status: "COMPLETED", created_at: new Date(), updated_at: new Date()},
      ];

      const findAndCountSpy = jest
        .spyOn(todoRepository, 'findAndCount')
        .mockResolvedValue([todos, todos.length]);

      const result = await todoService.findAll(paginationQuery);

      expect(result).toEqual({ todos, count: todos.length });
      expect(findAndCountSpy).toHaveBeenCalledWith({
        order: { created_at: paginationQuery.order },
        take: paginationQuery.limit,
        skip: paginationQuery.skip,
      });
    });
  });

  describe('find one todo by id', () => {
    it('should return a single todo', async () => {
      const todoId = '1';
      const todo =  { id: '1', title: 'Todo 1', description: 'description 1', status: "NOT_COMPLETED", created_at: new Date(), updated_at: new Date()};

      const findOneSpy = jest
        .spyOn(todoRepository, 'findOne')
        .mockResolvedValue(todo);

      const result = await todoService.findOne(todoId);

      expect(result).toEqual(todo);
      expect(findOneSpy).toHaveBeenCalledWith({
        where: { id: todoId },
      });
    });

    it('should throw NotFoundException if todo not found', async () => {
      const todoId = '300';

      jest.spyOn(todoRepository, 'findOne').mockResolvedValue(undefined);

      await expect(todoService.findOne(todoId)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update and return the updated todo', async () => {
      const todoId = '1';
      const updateTodoDto = { title: 'Updated Todo' };
      const existingTodo =  { id: '1', title: 'Todo 1', description: 'description 1', status: "COMPLETED", created_at: new Date(), updated_at: new Date()};

      const findOneSpy = jest
        .spyOn(todoRepository, 'findOne')
        .mockResolvedValue(existingTodo);

      const saveSpy = jest
        .spyOn(todoRepository, 'save')
        .mockResolvedValue({ ...existingTodo, ...updateTodoDto });

      const result = await todoService.update(todoId, updateTodoDto);

      expect(result).toEqual({ ...existingTodo, ...updateTodoDto });
      expect(findOneSpy).toHaveBeenCalledWith({ where: { id: todoId } });
      expect(saveSpy).toHaveBeenCalledWith({
        ...existingTodo,
        ...updateTodoDto,
      });
    });

    it('should throw NotFoundException if todo not found', async () => {
      const todoId = '200';
      const updateTodoDto = { title: 'Updated Todo' };

      jest.spyOn(todoRepository, 'findOne').mockResolvedValue(undefined);

      await expect(todoService.update(todoId, updateTodoDto)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove and return the removed todo', async () => {
      const todoId = '2';
      const existingTodo =  { id: '2', title: 'Todo 2', description: 'description 2', status: "NOT_COMPLETED", created_at: new Date(), updated_at: new Date()};

      const findOneSpy = jest
        .spyOn(todoRepository, 'findOne')
        .mockResolvedValue(existingTodo);

      const removeSpy = jest
        .spyOn(todoRepository, 'remove')
        .mockResolvedValue(existingTodo);

      const result = await todoService.remove(todoId);

      expect(result).toEqual(existingTodo);
      expect(findOneSpy).toHaveBeenCalledWith({ where: { id: todoId } });
      expect(removeSpy).toHaveBeenCalledWith(existingTodo);
    });

    it('should throw NotFoundException if todo not found', async () => {
      const todoId = '301';

      jest.spyOn(todoRepository, 'findOne').mockResolvedValue(undefined);

      await expect(todoService.remove(todoId)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

});
