import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';

const app: Express = express();

// ─── Security Middleware ───
app.use(helmet());

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true, // Required for HttpOnly cookies
}));

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// Rate limiter for auth routes — 10 requests per 15 minutes per IP
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
});

// ─── Routes ───
app.use('/api/users/register', authLimiter);
app.use('/api/users/login', authLimiter);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
});

// ─── Centralized Error Handling ───
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});

export default app;
