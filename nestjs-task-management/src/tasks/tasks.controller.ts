import { Body, Controller, Get, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.model';

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
    @Post()
    createTask( // destructuring the incomming post request
        @Body('title') title: string,
        @Body('description') description: string
    ): Task {
        return this.tasksService.createTask(title, description);
    }
}

