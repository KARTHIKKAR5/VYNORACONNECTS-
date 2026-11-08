import mongoose from 'mongoose';

/**
 * NotificationSetting Schema
 * Stores fine-grained user delivery preferences for push alerts, emails, and quiet hours.
 */
const NotificationSettingSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      directMessages: { type: Boolean, default: true },
      mentions: { type: Boolean, default: true },
      groupUpdates: { type: Boolean, default: false },
      systemAnnouncements: { type: Boolean, default: true },
      weeklyDigest: { type: Boolean, default: false },
    },
    push: {
      directMessages: { type: Boolean, default: true },
      mentions: { type: Boolean, default: true },
      groupUpdates: { type: Boolean, default: true },
      systemAnnouncements: { type: Boolean, default: false },
      soundAlerts: { type: Boolean, default: true },
    },
    inApp: {
      desktopBanners: { type: Boolean, default: true },
      messagePreviews: { type: Boolean, default: true },
      playSoundOnReceive: { type: Boolean, default: true },
      showUnreadCounters: { type: Boolean, default: true },
    },
    quietHours: {
      enabled: { type: Boolean, default: true },
      startTime: { type: String, default: '22:00' },
      endTime: { type: String, default: '07:00' },
    },
  },
  {
    timestamps: true,
  }
);

export const NotificationSetting = mongoose.model(
  'NotificationSetting',
  NotificationSettingSchema
);
