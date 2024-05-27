// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { Inject, Service } from 'typedi';

@Service()
export class AuthController {
    constructor(@Inject() private authService: AuthService) {}

    register = async (req: Request, res: Response) => {
        const { username, password } = req.body;
        try {
            const user = await this.authService.register(username, password);
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ message: 'Registration failed', error });
        }
    };

    login = async (req: Request, res: Response) => {
        const { username, password } = req.body;
        try {
            const token = await this.authService.login(username, password);
            if (!token) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            res.json({ token });
        } catch (error) {
            res.status(400).json({ message: 'Login failed', error });
        }
    };
}
