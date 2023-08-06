import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Status } from "../enums/todo.enums";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTodoDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    @IsEnum(Status)
    @IsNotEmpty()
    status: Status

}
