import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwtLib from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod';

export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string) => {
    return bcrypt.compare(password, hash);
};

export const generateToken = (userId: string) => {
    return jwtLib.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Security Middleware
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized, missing token' });
        return;
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwtLib.verify(token, JWT_SECRET) as { id: string };
        // @ts-ignore
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized, invalid token' });
    }
};
