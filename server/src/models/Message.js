import mongoose from 'mongoose';

/**
 * Message Schema
 * Stores individual chat messages exchanged inside conversations.
 */
const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true,
    },
    senderId: {
      type: String,
      required: true,
      index: true,
    },
    senderName: {
      type: String,
      default: 'Student',
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read'],
      default: 'sent',
    },
    // Track which participants have read this message
    readBy: [
      {
        userId: { type: String },
        readAt: { type: Date, default: Date.now },
      },
    ],
    // Optional file attachments or code snippets for student collaboration
    attachments: [
      {
        url: { type: String },
        name: { type: String },
        fileType: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Message = mongoose.model('Message', MessageSchema);
