import { Request, Response } from 'express';
import { RegisterSchema, LoginSchema } from '../utils/validators.js';
import { UserService } from '../services/UserService.js';
import { generateToken, setTokenCookie, clearTokenCookie, AuthenticatedRequest } from '../utils/auth.js';
import { User } from '../models/User.js';

export class UserController {
    static async register(req: Request, res: Response) {
        try {
            const parsedData = RegisterSchema.parse(req.body);
            const result = await UserService.registerUser(parsedData);
            const token = generateToken(result.user.id);
            setTokenCookie(res, token);
            res.status(201).json({ user: result.user });
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
            const token = generateToken(result.user.id);
            setTokenCookie(res, token);
            res.status(200).json({ user: result.user });
        } catch (error: any) {
            if (error.name === 'ZodError') {
                res.status(400).json({ error: error.errors });
            } else {
                res.status(401).json({ error: error.message });
            }
        }
    }

    static async me(req: Request, res: Response) {
        try {
            const authReq = req as AuthenticatedRequest;
            const user = await User.findById(authReq.user.id).select('-passwordHash');
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.status(200).json({
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    bio: user.bio || '',
                    avatarUrl: user.avatarUrl || '',
                    streak: user.streak ?? 0,
                    followersCount: user.followers?.length ?? 0,
                    followingCount: user.following?.length ?? 0,
                    createdAt: user.createdAt,
                },
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async logout(_req: Request, res: Response) {
        clearTokenCookie(res);
        res.status(200).json({ message: 'Logged out successfully' });
    }
}
