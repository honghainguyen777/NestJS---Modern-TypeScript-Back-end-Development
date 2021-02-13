import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';


@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    // tasksService has type of TaskService - a class
    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto,
    @GetUser() user: User,
    ) {
        return this.tasksService.getTasks(filterDto, user);
    }
    // // kind of request getAllTasks is going to handle
    // // @Query is when we want to retireve the query parameters (define in GetTaskFilterDto) all from the query parameters
    // // filerDto will take two params from the request path: tasks/?status=OPEN&search=hello
    // @Get()
    // // NestJS takes the DTO which is type of filterDto parameter and validate the incoming data based on class-vadiations that we add in GetTasksFilterDto
    // getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Task[] {
    //     // console.log(filterDto); // print {status: "OPEN", search: "hello"}
    //     // this will be sent back to clients
    //     if (Object.keys(filterDto).length) {
    //         return this.tasksService.getTasksWithFilters(filterDto);
    //     } else {
    //         return this.tasksService.getAllTasks();
    //     }
    // }

    // // @Post()
    // // createTask(@Body() body) { // nestjs will collect the entire request body and place it in body argument
    // //     console.log('body:', body);
    // //     // return this.tasksService.createTask();
    // // }
    // // @Post()
    // // createTask( // destructuring the incomming post request
    // //     @Body('title') title: string,
    // //     @Body('description') description: string
    // // ): Task {
    // //     return this.tasksService.createTask(title, description);
    // // }

    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
        return this.tasksService.getTaskById(id);
    }

    // // applying DTO
    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User,
    ): Promise<Task> {
        return this.tasksService.createTask(createTaskDto, user);
    }

    @Delete('/:id')
    deleteTask(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.tasksService.deleteTask(id);
    }

    @Patch('/:id/status')
    updateTask(
        @Param('id', ParseIntPipe) id: number, 
        @Body('status', TaskStatusValidationPipe) status: TaskStatus
    ): Promise<Task> {
        return this.tasksService.updateTaskStatus(id, status);
    }
}

