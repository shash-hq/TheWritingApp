import { Router } from 'express';
import { UserController } from '../controllers/UserController.js';
import { requireAuth } from '../utils/auth.js';

const router = Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/me', requireAuth, UserController.me);
router.post('/logout', UserController.logout);

export default router;
