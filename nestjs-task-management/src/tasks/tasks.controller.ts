import { Controller, Get } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    // tasksService has type of TaskService - a class
    constructor(private tasksService: TasksService) {}

    // kind of request getAllTasks is going to handle
    @Get()
    getAllTasks() {
        // this will be sent back to clients
        return this.tasksService.getAllTasks();
    }
}
