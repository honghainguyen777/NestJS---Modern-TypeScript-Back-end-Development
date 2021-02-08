import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { throws } from 'assert';
import { v1 as uuid} from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ){}
    // private tasks: Task[] = []; // been removed

    // getAllTasks(): Task[] {
    //     return this.tasks;
    // }

    // // this is filter feature for search engine
    // getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    //     const { status, search } = filterDto;
    //     let tasks = this.getAllTasks();

    //     if (status) {
    //         tasks = tasks.filter(task => task.status === status);
    //     }

    //     if (search) {
    //         tasks = tasks.filter(task => 
    //             task.title.includes(search) ||
    //             task.description.includes(search),
    //         )
    //     }

    //     return tasks;
    // }

    async getTaskById(id: number): Promise<Task> {
        const found = await this.taskRepository.findOne(id);
        if (!found) {
            throw new NotFoundException(`Task with ID "${id}" not found`); // 404 response, message = Not Found if not specify message by default
        }

        return found;
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto);
    }

    // getTaskById(id: string): Task {
    //     const found = this.tasks.find(task => task.id === id);
    //     if (!found) {
    //         throw new NotFoundException(`Task with ID "${id}" not found`); // 404 response, message = Not Found if not specify message by default
    //     }
    //     return found;
    // }

    // createTask(createTaskDto: CreateTaskDto): Task {
    //     const { title, description } = createTaskDto;
        
    //     const task: Task = {
    //         id: uuid(),
    //         title,
    //         description,
    //         status: TaskStatus.OPEN,
    //     };

    //     this.tasks.push(task);
    //     return task; // good practice to return the newly created resource in REST API because front-end will not need to call getAllTasks to update but update only the returned one
    // }

    // deleteTask(id: string): void {
    //     // if not found, throw error as in the getTaskById method
    //     const found = this.getTaskById(id);
    //     this.tasks = this.tasks.filter(task => task.id !== found.id);
    // }

    // updateTask(id: string, status: TaskStatus): Task {
    //     // return from the find() above return a reference not the element
    //     // we can change the status of the element here in the tasks array
    //     const task = this.getTaskById(id);
    //     task.status = status;
    //     return task;
    // }
}
