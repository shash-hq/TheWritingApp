import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwtLib from 'jsonwebtoken';

// ─── Read JWT_SECRET lazily (first access) so tests can set env before use ───
let _jwtSecret: string | undefined;
function getJwtSecret(): string {
    if (!_jwtSecret) {
        _jwtSecret = process.env.JWT_SECRET;
        if (!_jwtSecret) {
            throw new Error('FATAL: JWT_SECRET environment variable is not set. Aborting.');
        }
    }
    return _jwtSecret;
}

// ─── Typed authenticated request ───
export interface AuthenticatedRequest extends Request {
    user: { id: string };
}

// ─── Password utilities ───
export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string) => {
    return bcrypt.compare(password, hash);
};

// ─── JWT utilities ───
export const generateToken = (userId: string) => {
    return jwtLib.sign({ id: userId }, getJwtSecret(), { expiresIn: '7d' });
};

export const TOKEN_COOKIE_NAME = 'token';

export const setTokenCookie = (res: Response, token: string) => {
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie(TOKEN_COOKIE_NAME, token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/',
    });
};

export const clearTokenCookie = (res: Response) => {
    res.clearCookie(TOKEN_COOKIE_NAME, { path: '/' });
};

// ─── Auth middleware ───
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies?.[TOKEN_COOKIE_NAME];
    if (!token) {
        res.status(401).json({ error: 'Unauthorized, missing token' });
        return;
    }

    try {
        const decoded = jwtLib.verify(token, getJwtSecret()) as { id: string };
        (req as AuthenticatedRequest).user = { id: decoded.id };
        next();
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized, invalid token' });
    }
};
