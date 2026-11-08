import express from 'express';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
  getNotificationSettings,
  updateNotificationSettings,
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', getNotifications);
router.patch('/read-all', markAllNotificationsAsRead);
router.delete('/clear-all', clearAllNotifications);
router.patch('/:id/read', markNotificationAsRead);
router.delete('/:id', deleteNotification);

// Preferences
router.get('/settings', getNotificationSettings);
router.put('/settings', updateNotificationSettings);

export default router;
