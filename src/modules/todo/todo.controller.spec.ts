import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoResponseDto } from './dto/todo-response.dto';
import { TodoResponseListDto } from './dto/todo-response-list.dto';
import { IPaginationQuery } from './interface/todo.interface';
import { Status } from './enums/todo.enums';

describe('TodoController', () => {
  let todoController: TodoController;
  let todoService: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    todoController = module.get<TodoController>(TodoController);
    todoService = module.get<TodoService>(TodoService);
  });

  describe('create a todo', () => {
    it('should create a new todo', async () => {
      const createTodoDto: CreateTodoDto = {
        title: 'Test Todo',
        description: 'Test description',
        status: 'NOT_COMPLETED' as Status,
      };
      const createdTodo: TodoResponseDto = {
        id: '1',
        created_at: new Date(),
        updated_at: new Date(),
        ...createTodoDto,
      };

      jest.spyOn(todoService, 'create').mockResolvedValue(createdTodo);

      const result = await todoController.create(createTodoDto);

      expect(result).toEqual(createdTodo);
    });
  });

  describe('find all todos', () => {
    it('should return a list of todos', async () => {
      const paginationQuery: IPaginationQuery = {
        order: 'ASC',
        limit: 10,
        skip: 0,
      };
      const todoList: TodoResponseListDto = {
        todos: [
          { id: '1', title: 'Todo 1', description: 'description 1', status: "NOT_COMPLETED", created_at: new Date(), updated_at: new Date()},
          { id: '2', title: 'Todo 2', description: 'description 2', status: "COMPLETED", created_at: new Date(), updated_at: new Date()}
        ],
        count: 2,
      };

      jest.spyOn(todoService, 'findAll').mockResolvedValue(todoList);

      const result = await todoController.findAll(paginationQuery);

      expect(result).toEqual(todoList);
    });
  });

  describe('find single todo by id', () => {
    it('should return a single todo', async () => {
      const todoId = '1';
      const todo: TodoResponseDto =  { id: '1', title: 'Todo 1', description: 'description 1', status: "NOT_COMPLETED", created_at: new Date(), updated_at: new Date()};
      jest.spyOn(todoService, 'findOne').mockResolvedValue(todo);

      const result = await todoController.findOne(todoId);

      expect(result).toEqual(todo);
    });
  });

  describe('update', () => {
    it('should update and return the updated todo', async () => {
      const todoId = '1';
      const updateTodoDto: UpdateTodoDto = {
        title: 'Updated Todo',
        description: 'description 3',
        status: "NOT_COMPLETED" as Status,
      };
      const updatedTodo = { id: '1', title: 'Updated Todo', description: 'description 3', status: "NOT_COMPLETED", created_at: new Date(), updated_at: new Date()};

      jest.spyOn(todoService, 'update').mockResolvedValue(updatedTodo);

      const result = await todoController.update(todoId, updateTodoDto);

      expect(result).toEqual(updatedTodo);
    });
  });

  describe('remove', () => {
    it('should remove and return the removed todo', async () => {
      const todoId = '1';
      const removedTodo: TodoResponseDto = {
        id: todoId,
        title: 'Test Todo',
        description: '',
        status: 'COMPLETED',
        created_at: new Date(),
        updated_at: new Date()
      };

      jest.spyOn(todoService, 'remove').mockResolvedValue(removedTodo);

      const result = await todoController.remove(todoId);

      expect(result).toEqual(removedTodo);
    });
  });
});

