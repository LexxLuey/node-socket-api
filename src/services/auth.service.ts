// src/services/auth.service.ts
import { Service } from 'typedi';
import { User } from '../entity/User';
import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Service()
export class AuthService {
    private userRepository: Repository<User>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
    }

    async register(username: string, password: string): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({ username, password: hashedPassword });
        return this.userRepository.save(user);
    }

    async login(username: string, password: string): Promise<string | null> {
        const user = await this.userRepository.findOneBy({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return null;
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        return token;
    }
}
