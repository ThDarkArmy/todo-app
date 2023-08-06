import { TodoResponseDto } from "./todo-response.dto";

export class TodoResponseListDto{
    todos: TodoResponseDto[];
    count: number;
}