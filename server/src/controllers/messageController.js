import { Message } from '../models/Message.js';
import { Conversation } from '../models/Conversation.js';
import { getDbStatus } from '../config/db.js';

// In-memory message store for local development (empty by default - no fake chats)
let fallbackMessages = {};

/**
 * Get message history for a specific conversation
 */
export const getMessages = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { connected } = getDbStatus();

    if (connected) {
      const messages = await Message.find({ conversationId: id }).sort({ createdAt: 1 });
      const formatted = messages.map((m) => ({
        ...m.toObject(),
        id: m._id.toString(),
        timestamp: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }));
      return res.json(formatted);
    }

    return res.json(fallbackMessages[id] || []);
  } catch (error) {
    next(error);
  }
};

/**
 * Send a new message inside a conversation
 */
export const sendMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text, attachments = [] } = req.body;
    const { connected } = getDbStatus();

    if (!text || text.trim() === '') {
      return res.status(400).json({ success: false, message: 'Message text cannot be empty' });
    }

    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (connected) {
      const newMsg = await Message.create({
        conversationId: id,
        senderId: req.userId,
        text,
        status: 'sent',
        attachments,
      });

      // Update lastMessage on conversation
      await Conversation.findByIdAndUpdate(id, {
        lastMessage: {
          text,
          senderId: req.userId,
          timestamp: timestampStr,
          isRead: false,
        },
      });

      return res.status(201).json({
        ...newMsg.toObject(),
        id: newMsg._id.toString(),
        timestamp: timestampStr,
      });
    }

    // In-memory store
    const newMsg = {
      id: `msg-${Date.now()}`,
      conversationId: id,
      senderId: req.userId,
      text,
      timestamp: timestampStr,
      status: 'sent',
      attachments,
    };

    if (!fallbackMessages[id]) {
      fallbackMessages[id] = [];
    }
    fallbackMessages[id].push(newMsg);

    return res.status(201).json(newMsg);
  } catch (error) {
    next(error);
  }
};

/**
 * Clear messages for a conversation (utility for testing/reset)
 */
export const clearMessages = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { connected } = getDbStatus();

    if (connected) {
      await Message.deleteMany({ conversationId: id });
      await Conversation.findByIdAndUpdate(id, { lastMessage: null });
    }

    fallbackMessages[id] = [];
    return res.json({ success: true, message: 'Conversation cleared' });
  } catch (error) {
    next(error);
  }
};
