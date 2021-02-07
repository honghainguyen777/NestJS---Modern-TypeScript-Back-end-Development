# Project
## Installations
- Node.js: https://nodejs.org/en/download/
- NestJS installation in command line: `npm install -g @nestjs/cli`
- Install Postman to test endpoints: https://www.postman.com/downloads/
- VSCode extensions (optional): TypeScript Extension Pack
## Application Structure
### An AppModule (root) contains:
#### TasksModule
- TasksController
- TasksService
- StatusValiationPipe
- TaskEntity
- TaskRepository
- ... (add later)

#### AuthModule
- AuthController
- AuthService
- UserEntity
- UserRepository
- JwtStrategy
- ... (add later)

#### Communication between TaskModule and AuthModule

### API Endpoints - Tasks
|    Endpoint    | Method | Description |
| ---------- | ------------- | --------- |
| /tasks  | GET | Get tasks (incl. filters) |
| /tasks/:id  | GET | Get a task |
| /tasks  | POST | Create a task |
| /tasks/:id  | DELETE | Delete a task |
| /tasks/:id/status  | PATCH | Update task status |

### API Endpoints - Auth
|    Endpoint    | Method | Description |
| ---------- | ------------- | --------- |
| /auth/signup  | POST | Sign up |
| /auth/signin  | POST | Sign in |

## Start creating the project - task management
### Inititalize project
- `nest new nestjs-task-management`
### Remove some unnecessary files
- src/app.controller.spec.ts
- src/app.controller.ts
- src/app.service.ts
- Remove lines: controllers: `[AppController], providers: [AppService]` in the src/app.module.ts (@Module) also these import statements of those modules

### Files in the repository
- tsconfig.json: tell the TypeScript compiler how to compile the code
- tsconfig.build.json: an extension of the normal tsconfig.json. It is specific for when we build our application for production. It has some exclusion for certain folders in module folder to test folder in any file ending with *spec
- package.json: a classic file in any NPM project. It has information on dependencies, dev-dependencies of the project, etc.
- src folder: a place to write most of the code/business logic in the project

### Run project in dev mode
- `npm start dev`
- or `npm run start:dev`

### Create a Task Module
- `nest g module tasks` (`g` = generate, `module` = schematic/path relative to the root folder) -> create a `tasks` folder which contains `tasks.module.ts` in `src`. And the `app.module.ts` is updated

### Controllers in the application
- `AuthController` (`/auth`): `signin()` (`POST /auth/signin`); `signout()` (`POST /auth/signout`)
- `TasksController` (`/tasks`): `getAllTasks()` (`GET /tasks`); `getTaskById()` (`GET /tasks/:id`); `createTask()` (`POST /tasks`);` deleteTask()` (`DELETE /tasks/:id`); `updateTaskStatus()` (`PATH /tasks/:id`)
- `UsersController` (`/users`):` getUsers()` (`GET /users/:id`); `createUser()` (`POST /users`);` deleteUser()` (`DELETE /users/:id`)
- Create the tasks controller: `nest g controller tasks --no-spec`

#### Create a service
- `nest g service task --no-spec`
- --> new "`tasks.service.ts`" file created inside the src/tasks

#### Create models
- in the src/tasks: create a task.model.ts file
- `export interface Task {
    id: string,
    title: string,
    description: string,
    status: TaskStatus;
}

// status can only allow in enum
export enum TaskStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
}`
#### Connect model to service (get updatated) and controller (receive incomming request):
- In service:
`createTask(title: string, description: string): Task {
    const task: Task = {
        id: uuid(),
        title,
        description,
        status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
}
`
- In controller
`@Post()
createTask(
    @Body('title') title: string,
    @Body('description') description: string
): Task {
    return this.tasksService.createTask(title, description);
}`

- --> In comming HTTP request will come to the controller which the distribute title and desctiption to a service, service updata/retrive the information and return a data to controller -> send back the data to client via HTTP Response
- too many transfers and can be messy if we have more pips -> difficult to maintain and lose the sense of reliability in the shape of data

- --> better to use Data Transfer Objects (DTOs)
#### Data Transfer Objects (DTOs)
- create a new `dto` folder in `tasks`
- inside `dto`, create `create-task.dto.ts` file
- define `dto` as a TS class


#### Use NestJS Pipes for data validation
- Install class-validator and class-transformer: `npm install class-validator class-transformer`
- Perform the validation in the dto, create-task.dto.ts: add decorators that add some rults to each property of the dto
- https://github.com/typestack/class-validator#validation-decorators
- To use in DTO files:
```ts
import { IsNotEmpty } from 'class-validator';
export class CreateTaskDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;
}
```
- In the controller:
```ts
@Post()
@UsePipes(ValidationPipe)
createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto);
}
```

- Create custom validation pipes: create a folder `pipes` inside `tasks` folder. Inside pipes, create a file named `task-status-validation.pipe.ts`
EXP:
```ts
import { ArgumentMetadata, PipeTransform } from "@nestjs/common";

export class TaskStatusValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        console.log('value', value);
        console.log('metadata', metadata);
        
        return true;
    }
}
```
- --> Apply the pipe specifically to the status parameter in the tasks.controller.ts

- We can also use it in our DTOs.
```ts
export class GetTasksFilterDto {
    // check if the given value is empty, if so ignores all the validators on the property
    // here the status and search
    @IsOptional()
    // check if value is in a array of allowed values
    @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
    status: TaskStatus;

    @IsOptional()
    @IsNotEmpty()
    search: string;
}
```
- and inside the controller: `getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Task[] {...}`

### Database for this project: PostgreSQL and use pgAdmin administration and management

