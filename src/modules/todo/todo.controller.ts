import { Controller, Get, Post, Body, Param, Delete, UseGuards, HttpStatus, Query, Put } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TodoResponseDto } from './dto/todo-response.dto';
import { IPaginationQuery } from './interface/todo.interface';
import { TodoResponseListDto } from './dto/todo-response-list.dto';

@Controller('todo')
@ApiTags("todo")
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK, type: [TodoResponseDto] })
  public async create(@Body() createTodoDto: CreateTodoDto): Promise<TodoResponseDto> {
    return await this.todoService.create(createTodoDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  public async findAll(@Query() paginationQuery: IPaginationQuery): Promise<TodoResponseListDto>{
    return await this.todoService.findAll(paginationQuery);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  public async findOne(@Param('id') id: string): Promise<TodoResponseDto>  {
      return await this.todoService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  public async update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto): Promise<TodoResponseDto>  {
    return await this.todoService.update(id, updateTodoDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  public async remove(@Param('id') id: string) : Promise<TodoResponseDto> {
    return await this.todoService.remove(id);
  }
}
