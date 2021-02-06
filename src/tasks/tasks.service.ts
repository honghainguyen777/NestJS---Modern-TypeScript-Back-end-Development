import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v1 as uuid} from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTaskById(id: string): Task {
        return this.tasks.find(task => task.id === id);
    }

    createTask(createTaskDto: CreateTaskDto): Task {
        const { title, description } = createTaskDto;
        
        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN,
        };

        this.tasks.push(task);
        return task; // good practice to return the newly created resource in REST API because front-end will not need to call getAllTasks to update but update only the returned one
    }

    deleteTask(id: string): void {
        this.tasks = this.tasks.filter(task => task.id !== id);
    }

    updateTask(id: string, status: TaskStatus): Task {
        // return from the find() above return a reference not the element
        // we can change the status of the element here in the tasks array
        const task = this.getTaskById(id);
        task.status = status;
        return task;
    }
}
