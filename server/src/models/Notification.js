import mongoose from 'mongoose';

/**
 * Notification Schema
 * Stores alerts for mentions, direct messages, study group invites, and campus deadlines.
 */
const NotificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: String,
      required: true,
      index: true,
    },
    senderId: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      enum: ['mention', 'message', 'group', 'system', 'deadline'],
      default: 'system',
      required: true,
    },
    category: {
      type: String,
      enum: ['mentions', 'messages', 'groups', 'system'],
      default: 'system',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    actionLink: {
      type: String,
      default: null, // e.g., conversation ID to open on click
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Notification = mongoose.model('Notification', NotificationSchema);
