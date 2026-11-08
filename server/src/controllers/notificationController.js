import { Notification } from '../models/Notification.js';
import { NotificationSetting } from '../models/NotificationSetting.js';
import { getDbStatus } from '../config/db.js';

// Starts completely clean — real notifications only arrive when someone messages or mentions you
let fallbackNotifications = [];

let fallbackSettings = {
  email: {
    directMessages: true,
    mentions: true,
    groupUpdates: false,
    systemAnnouncements: true,
    weeklyDigest: false,
  },
  push: {
    directMessages: true,
    mentions: true,
    groupUpdates: true,
    systemAnnouncements: false,
    soundAlerts: true,
  },
  inApp: {
    desktopBanners: true,
    messagePreviews: true,
    playSoundOnReceive: true,
    showUnreadCounters: true,
  },
  quietHours: {
    enabled: true,
    startTime: '22:00',
    endTime: '07:00',
  },
};

/**
 * Get all notifications for current student
 */
export const getNotifications = async (req, res, next) => {
  try {
    const { connected } = getDbStatus();

    if (connected) {
      const notifs = await Notification.find({
        recipientId: req.userId,
      }).sort({ createdAt: -1 });

      const formatted = notifs.map((n) => ({
        ...n.toObject(),
        id: n._id.toString(),
      }));

      return res.json(formatted);
    }

    return res.json(fallbackNotifications);
  } catch (error) {
    next(error);
  }
};

/**
 * Mark a single notification as read
 */
export const markNotificationAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { connected } = getDbStatus();

    if (connected) {
      const updated = await Notification.findByIdAndUpdate(
        id,
        { isRead: true },
        { new: true }
      );
      return res.json({ success: true, notification: updated });
    }

    fallbackNotifications = fallbackNotifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    );
    return res.json({ success: true, notificationId: id });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark all notifications as read for current student
 */
export const markAllNotificationsAsRead = async (req, res, next) => {
  try {
    const { connected } = getDbStatus();

    if (connected) {
      await Notification.updateMany(
        { recipientId: req.userId, isRead: false },
        { isRead: true }
      );
      return res.json({ success: true, message: 'All notifications marked as read' });
    }

    fallbackNotifications = fallbackNotifications.map((n) => ({
      ...n,
      isRead: true,
    }));
    return res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a single notification
 */
export const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { connected } = getDbStatus();

    if (connected) {
      await Notification.findByIdAndDelete(id);
    }

    fallbackNotifications = fallbackNotifications.filter(
      (n) => n.id !== id && n._id !== id
    );

    return res.json({ success: true, id });
  } catch (error) {
    next(error);
  }
};

/**
 * Clear all notifications
 */
export const clearAllNotifications = async (req, res, next) => {
  try {
    const { connected } = getDbStatus();

    if (connected) {
      await Notification.deleteMany({ recipientId: req.userId });
    }

    fallbackNotifications = [];
    return res.json({ success: true, message: 'All notifications cleared' });
  } catch (error) {
    next(error);
  }
};

/**
 * Get notification settings
 */
export const getNotificationSettings = async (req, res, next) => {
  try {
    const { connected } = getDbStatus();

    if (connected) {
      let settings = await NotificationSetting.findOne({ userId: req.userId });
      if (!settings) {
        settings = await NotificationSetting.create({
          userId: req.userId,
          ...fallbackSettings,
        });
      }
      return res.json(settings);
    }

    return res.json(fallbackSettings);
  } catch (error) {
    next(error);
  }
};

/**
 * Update notification settings
 */
export const updateNotificationSettings = async (req, res, next) => {
  try {
    const { connected } = getDbStatus();
    const newSettings = req.body;

    if (connected) {
      const updated = await NotificationSetting.findOneAndUpdate(
        { userId: req.userId },
        newSettings,
        { new: true, upsert: true }
      );
      return res.json(updated);
    }

    fallbackSettings = { ...fallbackSettings, ...newSettings };
    return res.json(fallbackSettings);
  } catch (error) {
    next(error);
  }
};
