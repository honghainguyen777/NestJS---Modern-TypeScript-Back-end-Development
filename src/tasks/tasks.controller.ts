import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus} from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
    // tasksService has type of TaskService - a class
    constructor(private tasksService: TasksService) {}

    // kind of request getAllTasks is going to handle
    @Get()
    getAllTasks(): Task[] {
        // this will be sent back to clients
        return this.tasksService.getAllTasks();
    }

    // @Post()
    // createTask(@Body() body) { // nestjs will collect the entire request body and place it in body argument
    //     console.log('body:', body);
    //     // return this.tasksService.createTask();
    // }
    // @Post()
    // createTask( // destructuring the incomming post request
    //     @Body('title') title: string,
    //     @Body('description') description: string
    // ): Task {
    //     return this.tasksService.createTask(title, description);
    // }

    @Get('/:id')
    getTaskById(@Param('id') id: string): Task {
        return this.tasksService.getTaskById(id);
    }

    // applying DTO
    @Post()
    createTask(@Body() createTaskDto: CreateTaskDto): Task {
        return this.tasksService.createTask(createTaskDto);
    }

    @Delete('/:id')
    deleteTask(@Param('id') id: string): void {
        this.tasksService.deleteTask(id);
    }

    @Patch('/:id/status')
    updateTask(@Param('id') id: string, @Body('status') status: TaskStatus): Task {
        return this.tasksService.updateTask(id, status);
    }
}

