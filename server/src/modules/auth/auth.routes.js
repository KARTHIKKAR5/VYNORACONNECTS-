import { Router } from 'express';
import { authController } from './auth.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);

// Protected routes
router.get('/me', authenticateUser, authController.getMe);
router.patch('/me', authenticateUser, authController.updateMe);

export default router;
