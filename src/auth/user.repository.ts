import { EntityRepository, Repository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcryptjs';

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
        const salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, salt);
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

    // validate if the password is correct
    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { username, password } = authCredentialsDto;
        const user = await this.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            return user.username;
        } else {
            return null;
        }

    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}