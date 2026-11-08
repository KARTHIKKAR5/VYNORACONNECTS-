import { Router } from 'express';
import { authController } from './auth.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);

// Strictly protected routes (require valid JWT)
router.get('/me', requireAuth, authController.getMe);
router.patch('/me', requireAuth, authController.updateMe);

export default router;
