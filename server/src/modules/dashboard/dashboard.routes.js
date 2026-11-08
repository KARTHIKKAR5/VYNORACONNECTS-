import { Router } from 'express';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import * as dashboardController from './dashboard.controller.js';

const router = Router();

// All dashboard endpoints require authenticated user session
router.use(authenticateUser);

router.get('/', dashboardController.getDashboard);
router.get('/preferences', dashboardController.getPreferences);
router.patch('/preferences', dashboardController.updatePreferences);

export default router;
