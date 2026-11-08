import mongoose from 'mongoose';

/**
 * Conversation Schema
 * Represents both direct 1-on-1 student conversations and multi-member study groups.
 */
const ConversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['direct', 'group'],
      default: 'direct',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: 'Student Chat',
      trim: true,
    },
    status: {
      type: String,
      enum: ['online', 'away', 'busy', 'offline'],
      default: 'offline',
    },
    // Array of student user IDs participating in this chat
    participants: [
      {
        type: String,
        required: true,
      },
    ],
    pinned: {
      type: Boolean,
      default: false,
    },
    unreadCount: {
      type: Number,
      default: 0,
    },
    // Quick preview of the latest message for the conversation list
    lastMessage: {
      text: { type: String, default: '' },
      senderId: { type: String, default: '' },
      senderName: { type: String, default: '' },
      timestamp: { type: String, default: '' },
      isRead: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

export const Conversation = mongoose.model('Conversation', ConversationSchema);
