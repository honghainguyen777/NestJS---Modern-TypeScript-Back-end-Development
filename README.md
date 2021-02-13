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
- Use PostgreSQL as database and manage by pgAdmin
- Query in NestJS using TypeORM (Object Relational Mapping for TypeScript and JavaScript).
- Install: `npm install @nestjs/typeorm typeorm pg` -> `pg` is database driver for postgreSQL, `typeorm` is TypeORM npm module, `@nestjs/typeorm` is specific bridge that NestJS created for working with typeORM
- We have multiple ways of configuring the database connection. One way is using a static JSON file, another way could be providing the data as an object, the third way could be proving the data asynchronously form a service.
- We create a `typeorm.config.ts` file under the src/config folder
```ts
export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '<password here>',
    database: '<name of the database>',
    autoLoadEntities: true,
    synchronize: true,
};
```
- In the `app.module.ts`
```ts
@Module({
  imports: [TasksModule,
  TypeOrmModule.forRoot(typeOrmConfig)],
})
```
- Create an entity for the app: create `task.entity.ts` under the `tasks` folder
- Define entities:
```ts
@Entity()
export class Task extends BaseEntity {
    // define an id as a number, a primary value and increase when we create a new task
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: TaskStatus;
}
```

- We could use the entity classing our service to perform operations such as finding tasks, leading tasks, creating tasks etc. However, this may end up with a lot of code or any database operations.
- --> We want to split logic if we can always as long as the split makes sense. -> Persistence layer in the shape of a repository. By using repositories for our entities, we apply that repository pattern (http://typeorm.delightful.studio/classes/_repository_repository_.repository.html).
- In the repository we can still perform same operations we would normally perform on the Entity class directly, but we can also add more custom logic -> become very useful in our application. -> We end up encapsulating heavy logic related to persistence layer to our database and we also end up removing code from our service which results in shorter methods into service and code that is easier to understand.
- We create a file: `task.repository.ts` in the `tasks` folder.
```ts
@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    // see detailed code below
}
```
- we have to ask the TaskRepository to our ecosystem in the task.module.ts
```ts
@Module({
  imports: [
    TypeOrmModule.forFeature([TaskRepository]) // all repositories we want to include in our ecosystem (the tasks module)
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
```
- --> we have everything ready for applying data persistence through the application. --> we have to refactor the code by commenting all methods in both the controller and the service. We also can delete our Task interface (task.model.ts) because we have already defined the task data in our Entity. We move the:
```ts
export enum TaskStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
}
```
to a new file: `task-status.enum.ts`. And remove the `task.model.ts`. We also don't need `uuid` package because we have `@PrimaryGeneratedColumn()` decorator

#### Object Relational Mapping (ORM) and TypeORM

##### Object Relational Mapping (ORM)
- ORM is a technique that lets you query and manipulate data from a database, using an object-oriented paradigm.
- There are many ORM libraries that allow developers to communicate to the database using their preferred programming language - rather than sending plain queries directly.
- Pros and Cons of using an ORM library:
###### Pros
- Writing the data model in one place - easier to maintain. Less repetition.
- Lots of things done automatically - database handlong, data types, relations etc.
- No need to write SQL syntax (easy to learn, hard to master). Using your natural way of coding
- Database abstraction - you can change the database type whenever you wish.
- Leverages OPP, therefore things like inheritance are easy to achieve.
###### Cons
- You have to learn it, and ORM libraries are not always simple.
- Performance is alright, but it's easy to neglect
- Makes it easy to forget (or never learn) what's happening behind the scenes, which can lead to variety of maintainability issues.

##### TypeORM
- TypeORM is an ORM library that can run in Node.js and be used with TypeScript (or JavaScript).
- It helps us define and manage entities, repositories, columns, relations, replication, indices, queries, logging and so much more.
EXP: Retrieving all tasks owned by "Ashley" and are of status "Done".
TypeORM: const tasks = await Task.find({status:'DONE', user: 'Ashley'});
Pure JavaScript:
db.query('SELECT * FROM tasks WHERE status = "DONE" AND user = "Ashley"', (err, result) => {
	if (err) {
		throw new Error('Could not retrieve tasks!');
	}
	tasks = result.rows;
});
- read more typeORM: https://typeorm.io

#### TypeORM in this project
- Refactoring the services using async-await (query data from database take some time)
- Introducing EntityRepository:
```ts
@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');
        if (status) {
            query.andWhere('task.status = :status', { status });
        }
        if (search) {
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` });
        }
        const tasks = await query.getMany();
        return tasks;
    }
    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const { title, description } = createTaskDto;
        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        await task.save();
        return task;
    }
}
```

- Refactor all methods in service
```ts
@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ){}

    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto)
    }

    async getTaskById(id: number): Promise<Task> {
        const found = await this.taskRepository.findOne(id);
        if (!found) {
            throw new NotFoundException(`Task with ID "${id}" not found`); 
        }

        return found;
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto);
    }

    async deleteTask(id: number): Promise<void> {
        const result = await this.taskRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
    }

    async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id);
        task.status = status;
        await task.save();
        return task;
    }
}
```
- Refactor all methods in controller
```ts
@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto) {
        return this.tasksService.getTasks(filterDto);
    }
    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
        return this.tasksService.getTaskById(id);
    }
    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
        return this.tasksService.createTask(createTaskDto);
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
```
### Authentication, authorization and users
- Generate Auth module: `nest g module auth`
- Generate Auth controller: `nest g controller auth --no-spec`
- Generate Auth service: `nest g service auth --no-spec`

#### Setup database-related works
- Crete `user.entity.ts` file under auth folder.
```ts
@Entity()
@Unique(['username'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;
}
```
- `@Unique(['username'])` will talk later in the validation (existance of username)
- Create a `user.repository.ts` under auth folder for heavy database related logic so that we don't have to write it in the service.
```ts
@EntityRepository(User)
export class UserRepository extends Repository<User> {
    
}
```
- To make use the UserRepository available for in injection throughout our modelue, import it to Our Module (auth.module.ts):

```ts
@Module({
    imports: [
        TypeOrmModule.forFeature([UserRepository])
    ],
  ...
})
```
- In the auth service, inject the UserRepository using dependency Injection in the constructor. UserRepository now can be used inside the AuthService class
```ts
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ){}
}
```

#### Signup in dto folder under auth

##### User Input validation
- create a `auth-credentials.dto.ts` file for handling signup, signin
```ts
export class AuthCredentialsDto {
    username: string;
    password: string;
}
```
- Create signUp method in UserRepository class:
```ts
async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const user = new User();
    user.username = username;
    user.password = password;
    await user.save();
}
```
- Inject the signUp to our Auth service
```ts
async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.signUp(authCredentialsDto);
}
```
- Call the signUp service method and be triggered by our Rest API (after inject dependency injection into our controller). 
```ts
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ){}

    @Post('/signup')
    signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.authService.signUp(authCredentialsDto);
    }
}
```

- Validation:
```ts
export class AuthCredentialsDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    // @MaxLength(20, {message: <customer message>})
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: "password too weak"})
    password: string;
}
```
Using regular expression in the password will strengthen the password. Here, at least one number or special character.

- Apply the validation rules to our entire request Body in the controller using ValidationPipe: 
```ts
signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void> {...}
```

##### Check existance of username
- Two ways to do this validation: 
1. logic in the user.repository.ts: 
```ts
const exists = this.findOne({ username });
if (exists) {
    // ... throw some error
}
```
- -> with this, we have to send two queries to the database (`findOne`, and `await user.save()`)

2. Specify the username as unique in the database level: add `@Unique(['username'])` decorator in the User class (`user.entity.ts`)
- When we create a new user, and perform user.save() in the Signup class, the database will respond with an Internal Server Error.
- Now the UserRepository will be:
```ts
@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto;
        const user = new User();
        user.username = username;
        user.password = password;
        try {
            await user.save();
        } catch(error) {
            if (error.code === '23505') { // duplicate username
                throw new ConflictException("Username already exists");
            } else {
                throw new InternalServerErrorException(); // throw 600 error for anything that is on handled
            }
        }
    }
}
```   

##### Security: Hashing Password & Using Salts
- Salt is unique for every user
- Using bcryot package: `npm install bcrypt`;
- In user.repository.ts:
```ts
import * as bcrypt from "bcrypt";
```
- create a private method inside the UserRepository to perform password hashing
```ts
private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
}
```
<!-- - We also need to store the `salt` for each user. Add new field in the user.entity.ts:
```ts
@Column()
salt: string;
``` -->
- we actually don't need to save the salt. Salt is already included in the hashed password. Saving salts are used in bcrypt exclusively.
- generate salt and hash the password
```ts
const salt = await bcrypt.genSalt();
user.password = await this.hashPassword(password, salt); // store the salt
```

- Password validation (Signin): -> return username if the password is correct
```ts
async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
        return user.username;
    } else {
        return null;
    }
}
```
- Inject the validateUserPassword to our Auth service
```ts
async signIn(AuthCredentialsDto: AuthCredentialsDto) {
    const username = await this.userRepository.validateUserPassword(AuthCredentialsDto);
    if (!username) {
        throw new UnauthorizedException("Invalid credentials");
    }
}
```

##### Setting up the JWT Module and Passport.js
- Installation: `npm install @nestjs/jwt @nestjs/passport passport passport-jwt` (here `@nestjs/jwt` is the wrapper for the module from nestjs for implementing jwt, `@nestjs/jwt` is the wrapper for the module from nestjs for implementing passport, `passport` is the actual passport library, `passport-jwt` is for configuring passport to use jwt tokens)
- add passprt stratery amd JwtModule into imports field of our Module (auth.module.ts):
```ts
PassportModule.register({ defaultStrategy: 'jwt' }),
JwtModule.register({
    secret: JWT_SECRET, // save key
    signOptions: {
    expiresIn: 3600,
    }
}),
```
- -> we imported JwtModule in the @Module, now the Module exports a service provider, and then when you go to get a jwt service and with this service, you can perform certain operations such as creating the tokens, signing the token. That means we can inject it using dependency injection by adding a property to the `AuthService`: `private jwtService: JwtService`
- Generating jwt token when the user signin successfully, and then return the access token:
```ts
async signIn(AuthCredentialsDto: AuthCredentialsDto) {
    ...
    const payload = { username }; // no sensitive infor
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
}
```
- It may be better if we extract the payload structure into an `interface` because it will be will be used in more places around the application. -> create `jwt-payload.interface.ts` in the `auth` folder.
- In signin service:
```ts
async signIn(AuthCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
    ...
    const payload: JwtPayload = { username }; // payload of type JwtPayload
    ....
}
```
- Add the return type of SignIn controller:
```ts
signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {}
```
###### Setting up the JWT Strategy for Authorization
- create `jwt.strategy.ts` file in the auth module
- create an Injectable strategy:
```ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        // userRepository injected to our strategy
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_SECRET,
        });
    }

    async validate(payload: JwtPayload): Promise<User> { //must exist when defining a strategy
        const { username } = payload;
        const user = await this.userRepository.findOne({ username });

        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
```
- add the service as a provider to auth module auth.module,ts:
```ts
providers: [
    AuthService,
    JwtStrategy, // here
]
```
- we also export the JwtStratery so it can be used in other modules for certain operations, also PassportModule to guard other operations with Jwt and passport.js:
```ts
provides: [...],
exports: [
    JwtStrategy,
    PassportModule,
]
```
- create temporary handler in the auth.controller.ts for testing our authorization:
```ts
@Post('/test')
@UseGuards(AuthGuard()) // controller-scoped guard (we can also have method-scoped, or global-scoped). This one is only for the test()
test(@Req() req) { // @Req() to get entire request incl. body, header,...
    console.log(req);
}
```
- Test in Postman: POST request, add `Authorization` to Headers with value of "Bearer <assestoken-from-signin>" 


###### Utilize Passport to retrieve the user entity from the database and inject into the request object (This is only for testing to get the use infor)
- Best way is to create a custom Decorator to get only the data we want in the request object
- create a `get-user.decorator.ts` file:
```ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.entity';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
});
```
- Now we can get the user from the request
```ts
@Post('/test')
@UseGuards(AuthGuard())
test(@GetUser() user: User) {
    console.log(user);
}
```
--> Only for testing, comment it out when running the application

##### Guarding the Tasks routes (Tasks controller) using AuthGuard of passport (defined in jwt.strategy.ts)
- We need to import the Auth Module into the Task Module. Add `AuthModule` to the `imports` array of the `@Module` (tasks/tasks.module.ts).
- Apply some Guard/s in to Tasks controller for the entire TasksController class (tasks.modules.ts):
```ts
@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {}
```
##### Authoziation - Task Ownership
- create Task field in the User.Entity using one to many typeorm relationship (one user to many tasks)
```ts
// type is Task, and the task is liked to task.user
// eager = true we can get tasks by user.tasks immediately
@OneToMany(type => Task, task => task.user, {eager: true})
tasks: Task[];
```
- In the task entity, we want to connect user to each task (many tasks to one user):
```ts
// only one side of the relation is eager = true
@ManyToOne(type => User, user => user.tasks, { eager: false})
user: User;
```
###### Apply the relationships in practice
- get the user info from the request using GetUser custom decorator in the createTask controller:
```ts
@Post()
@UsePipes(ValidationPipe)
createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User, // here
): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, user); // pass the user to the createTask method
}
```
- use the user in the createTask service (tasks.service.ts):
```ts
async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> { // here
    return this.taskRepository.createTask(createTaskDto, user);// pass it to the createTask method in the taskRepository
}
```
- create and update the database in the taskRepository (task.repository.ts):
```ts
async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    ...
    task.user = user;
    await task.save();
    delete task.user; // we dont want to return a task containing user information
    return task;
}
```