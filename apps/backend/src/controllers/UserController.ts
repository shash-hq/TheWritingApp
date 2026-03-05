import { Request, Response } from 'express';
import { RegisterSchema, LoginSchema } from '../utils/validators.js';
import { UserService } from '../services/UserService.js';

export class UserController {
    static async register(req: Request, res: Response) {
        try {
            const parsedData = RegisterSchema.parse(req.body);
            const result = await UserService.registerUser(parsedData);
            res.status(201).json(result);
        } catch (error: any) {
            if (error.name === 'ZodError') {
                res.status(400).json({ error: error.errors });
            } else {
                res.status(400).json({ error: error.message });
            }
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const parsedData = LoginSchema.parse(req.body);
            const result = await UserService.loginUser(parsedData);
            res.status(200).json(result);
        } catch (error: any) {
            if (error.name === 'ZodError') {
                res.status(400).json({ error: error.errors });
            } else {
                res.status(401).json({ error: error.message });
            }
        }
    }
}
