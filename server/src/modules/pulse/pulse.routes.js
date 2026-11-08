import { Router } from 'express';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import * as pulseController from './pulse.controller.js';

const router = Router();

// Pulse feed requires authenticated context for personalized visibility and preferences
router.use(authenticateUser);

router.get('/', pulseController.getPulse);

export default router;

