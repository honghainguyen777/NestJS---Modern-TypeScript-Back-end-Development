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