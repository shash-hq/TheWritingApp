import { Request, Response } from 'express';
import { z } from 'zod';
import { Post } from '../models/Post.js';
import { AuthenticatedRequest } from '../utils/auth.js';

const CreatePostSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200),
    content: z.string().min(1, 'Content is required'),
    tags: z.array(z.string().trim().max(30)).max(5).optional(),
    isPublic: z.boolean().optional(),
});

const UpdatePostSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    content: z.string().min(1).optional(),
    tags: z.array(z.string().trim().max(30)).max(5).optional(),
    isPublic: z.boolean().optional(),
});

export class PostController {
    /** POST /api/posts — create a new post (auth required) */
    static async create(req: Request, res: Response) {
        try {
            const authReq = req as AuthenticatedRequest;
            const data = CreatePostSchema.parse(req.body);
            const post = await Post.create({ ...data, authorId: authReq.user.id });
            res.status(201).json({ post });
        } catch (error: any) {
            if (error.name === 'ZodError') {
                res.status(400).json({ error: error.errors });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }

    /** GET /api/posts — public feed, newest first, paginated */
    static async listPublic(req: Request, res: Response) {
        try {
            const page = Math.max(1, parseInt(req.query.page as string) || 1);
            const limit = Math.min(30, Math.max(1, parseInt(req.query.limit as string) || 12));
            const skip = (page - 1) * limit;

            const [posts, total] = await Promise.all([
                Post.find({ isPublic: true })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .populate('authorId', 'username')
                    .lean(),
                Post.countDocuments({ isPublic: true }),
            ]);

            res.json({ posts, total, page, pages: Math.ceil(total / limit) });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    /** GET /api/posts/my — authenticated user's own posts */
    static async listMine(req: Request, res: Response) {
        try {
            const authReq = req as AuthenticatedRequest;
            const posts = await Post.find({ authorId: authReq.user.id })
                .sort({ updatedAt: -1 })
                .lean();
            res.json({ posts });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    /** GET /api/posts/:id — single post (public posts open to all, private posts only to owner) */
    static async getById(req: Request, res: Response) {
        try {
            const post = await Post.findById(req.params.id)
                .populate('authorId', 'username')
                .lean();
            if (!post) {
                res.status(404).json({ error: 'Post not found' });
                return;
            }
            // Private posts: only the owner can read
            if (!post.isPublic) {
                const authReq = req as AuthenticatedRequest;
                if (!authReq.user || authReq.user.id !== String(post.authorId._id ?? post.authorId)) {
                    res.status(404).json({ error: 'Post not found' });
                    return;
                }
            }
            res.json({ post });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    /** PATCH /api/posts/:id — update (owner only) */
    static async update(req: Request, res: Response) {
        try {
            const authReq = req as AuthenticatedRequest;
            const data = UpdatePostSchema.parse(req.body);
            const post = await Post.findOneAndUpdate(
                { _id: req.params.id, authorId: authReq.user.id },
                { $set: data },
                { new: true },
            ).lean();
            if (!post) {
                res.status(404).json({ error: 'Post not found or not yours' });
                return;
            }
            res.json({ post });
        } catch (error: any) {
            if (error.name === 'ZodError') {
                res.status(400).json({ error: error.errors });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }

    /** DELETE /api/posts/:id — delete (owner only) */
    static async delete(req: Request, res: Response) {
        try {
            const authReq = req as AuthenticatedRequest;
            const post = await Post.findOneAndDelete({
                _id: req.params.id,
                authorId: authReq.user.id,
            });
            if (!post) {
                res.status(404).json({ error: 'Post not found or not yours' });
                return;
            }
            res.json({ message: 'Post deleted' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
