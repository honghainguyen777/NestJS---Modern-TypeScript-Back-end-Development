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
