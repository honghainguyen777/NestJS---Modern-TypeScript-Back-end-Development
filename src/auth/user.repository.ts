import { EntityRepository, Repository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ConflictException, InternalServerErrorException } from "@nestjs/common";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto;

        // const exists = this.findOne({ username });

        // if (exists) {
        //     // ... throw some error
        // }

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