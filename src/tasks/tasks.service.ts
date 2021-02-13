import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { throws } from 'assert';
import { User } from 'src/auth/user.entity';
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

    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto, user)
    }
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

    // getTaskById(id: string): Task {
    //     const found = this.tasks.find(task => task.id === id);
    //     if (!found) {
    //         throw new NotFoundException(`Task with ID "${id}" not found`); // 404 response, message = Not Found if not specify message by default
    //     }
    //     return found;
    // }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
    }

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

    // 1st way of removing an entity
    // async deleteTask(id: number): Promise<void> {
    //     const found = await this.getTaskById(id);
    //     // we can pass in an array of entities -> multiple entities removed
    //     // better to use delete because it task two time accessing the database
    //     // one is getTaskById and the second is remove
    //     await this.taskRepository.remove(found);
    // }

    // 2nd way of removing an entity
    async deleteTask(id: number): Promise<void> {
        const result = await this.taskRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
    }

    // deleteTask(id: string): void {
    //     // if not found, throw error as in the getTaskById method
    //     const found = this.getTaskById(id);
    //     this.tasks = this.tasks.filter(task => task.id !== found.id);
    // }

    async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id);
        task.status = status;
        await task.save();
        return task;
    }

    // updateTask(id: string, status: TaskStatus): Task {
    //     // return from the find() above return a reference not the element
    //     // we can change the status of the element here in the tasks array
    //     const task = this.getTaskById(id);
    //     task.status = status;
    //     return task;
    // }
}
