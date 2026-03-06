import { Router } from 'express';
import { PostController } from '../controllers/PostController.js';
import { requireAuth } from '../utils/auth.js';

const router = Router();

// Protected routes — must come before /:id to avoid "my" being treated as an id
router.post('/', requireAuth, PostController.create);
router.get('/my', requireAuth, PostController.listMine);

// Public routes
router.get('/', PostController.listPublic);
router.get('/:id', PostController.getById);

// Owner-only mutations
router.patch('/:id', requireAuth, PostController.update);
router.delete('/:id', requireAuth, PostController.delete);

export default router;
