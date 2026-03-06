import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

// ─── vi.hoisted ensures these exist before vi.mock factory runs ───
const { mockFindOne, mockFindById, mockSave } = vi.hoisted(() => ({
    mockFindOne: vi.fn(),
    mockFindById: vi.fn(),
    mockSave: vi.fn(),
}));

// ─── Mock mongoose BEFORE importing app ───
vi.mock('mongoose', () => {
    class MockSchema {
        constructor() { }
        index() { return this; }
    }
    (MockSchema as any).Types = { ObjectId: String };

    return {
        default: {
            connect: vi.fn(),
            model: vi.fn((_name: string) => {
                const constructor: any = function (data: any) {
                    return Object.assign(Object.create(constructor.prototype), data, { _id: 'mocked_id_123' });
                };
                constructor.findOne = mockFindOne;
                constructor.findById = mockFindById;
                constructor.prototype.save = mockSave;
                return constructor;
            }),
            Schema: MockSchema,
            Types: { ObjectId: String },
        },
        Schema: MockSchema,
        Document: class { },
        model: vi.fn(),
    };
});

// Set environment variables before importing app
process.env.JWT_SECRET = 'test_secret_for_vitest_only';
process.env.NODE_ENV = 'test';

import app from '../app.js';
import bcrypt from 'bcryptjs';

describe('Auth API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockSave.mockResolvedValue(undefined);
    });

    // ─── Registration ───
    describe('POST /api/users/register', () => {
        it('should return 400 for weak password', async () => {
            const res = await request(app)
                .post('/api/users/register')
                .send({ username: 'test', email: 'test@test.com', password: 'short' });
            expect(res.status).toBe(400);
        });

        it('should return 400 for invalid username (special chars)', async () => {
            const res = await request(app)
                .post('/api/users/register')
                .send({ username: 'bad user!', email: 'test@test.com', password: 'StrongP@ss1' });
            expect(res.status).toBe(400);
        });

        it('should return 400 for password missing uppercase', async () => {
            const res = await request(app)
                .post('/api/users/register')
                .send({ username: 'testuser', email: 'test@test.com', password: 'weakpass1!' });
            expect(res.status).toBe(400);
        });

        it('should return 400 when user already exists', async () => {
            mockFindOne.mockResolvedValueOnce({ _id: 'existing' });

            const res = await request(app)
                .post('/api/users/register')
                .send({ username: 'existinguser', email: 'exists@test.com', password: 'StrongP@ss1' });
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('User already exists');
        });

        it('should return 201 and set httpOnly cookie on successful registration', async () => {
            mockFindOne.mockResolvedValueOnce(null);
            mockSave.mockResolvedValueOnce(undefined);

            const res = await request(app)
                .post('/api/users/register')
                .send({ username: 'newuser', email: 'new@test.com', password: 'StrongP@ss1' });

            expect(res.status).toBe(201);
            expect(res.body.user).toBeDefined();

            const cookies = res.headers['set-cookie'];
            expect(cookies).toBeDefined();
            const tokenCookie = Array.isArray(cookies)
                ? cookies.find((c: string) => c.startsWith('token='))
                : (cookies as string);
            expect(tokenCookie).toContain('HttpOnly');
        });
    });

    // ─── Login ───
    describe('POST /api/users/login', () => {
        it('should return 401 when user not found', async () => {
            mockFindOne.mockResolvedValueOnce(null);

            const res = await request(app)
                .post('/api/users/login')
                .send({ email: 'nonexistent@test.com', password: 'StrongP@ss1' });
            expect(res.status).toBe(401);
            expect(res.body.error).toBe('Invalid credentials');
        });

        it('should return 401 for wrong password', async () => {
            const hashedPassword = await bcrypt.hash('CorrectP@ss1', 10);
            mockFindOne.mockResolvedValueOnce({
                _id: 'user123', username: 'testuser', email: 'test@test.com', passwordHash: hashedPassword,
            });

            const res = await request(app)
                .post('/api/users/login')
                .send({ email: 'test@test.com', password: 'WrongP@ss1' });
            expect(res.status).toBe(401);
            expect(res.body.error).toBe('Invalid credentials');
        });

        it('should return 200 and set httpOnly cookie on success', async () => {
            const hashedPassword = await bcrypt.hash('StrongP@ss1', 10);
            mockFindOne.mockResolvedValueOnce({
                _id: 'user123', username: 'testuser', email: 'test@test.com', passwordHash: hashedPassword,
            });

            const res = await request(app)
                .post('/api/users/login')
                .send({ email: 'test@test.com', password: 'StrongP@ss1' });

            expect(res.status).toBe(200);
            expect(res.body.user.username).toBe('testuser');

            const cookies = res.headers['set-cookie'];
            expect(cookies).toBeDefined();
            const tokenCookie = Array.isArray(cookies)
                ? cookies.find((c: string) => c.startsWith('token='))
                : (cookies as string);
            expect(tokenCookie).toContain('HttpOnly');
        });
    });

    // ─── /me ───
    describe('GET /api/users/me', () => {
        it('should return 401 without cookie', async () => {
            const res = await request(app).get('/api/users/me');
            expect(res.status).toBe(401);
        });

        it('should return user data with valid cookie', async () => {
            // Login to get the cookie
            const hashedPassword = await bcrypt.hash('StrongP@ss1', 10);
            mockFindOne.mockResolvedValueOnce({
                _id: 'user123', username: 'testuser', email: 'test@test.com', passwordHash: hashedPassword,
            });

            const loginRes = await request(app)
                .post('/api/users/login')
                .send({ email: 'test@test.com', password: 'StrongP@ss1' });

            const cookies = loginRes.headers['set-cookie'];

            // Mock findById for /me
            mockFindById.mockReturnValueOnce({
                select: vi.fn().mockResolvedValueOnce({
                    _id: 'user123', username: 'testuser', email: 'test@test.com',
                }),
            });

            const meRes = await request(app)
                .get('/api/users/me')
                .set('Cookie', cookies as string[]);

            expect(meRes.status).toBe(200);
            expect(meRes.body.user.username).toBe('testuser');
        });
    });

    // ─── Logout ───
    describe('POST /api/users/logout', () => {
        it('should return 200 and clear cookie', async () => {
            const res = await request(app).post('/api/users/logout');
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Logged out successfully');
        });
    });

    // ─── Health ───
    describe('GET /health', () => {
        it('should return ok', async () => {
            const res = await request(app).get('/health');
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('ok');
        });
    });

    // ─── Rate limiting ───
    describe('Rate limiting', () => {
        it('should return 429 after exceeding limit on login', async () => {
            mockFindOne.mockResolvedValue(null);

            const requests = Array.from({ length: 11 }, () =>
                request(app)
                    .post('/api/users/login')
                    .send({ email: 'test@test.com', password: 'StrongP@ss1' })
            );

            const responses = await Promise.all(requests);
            const statuses = responses.map(r => r.status);
            expect(statuses).toContain(429);
        });
    });
});
