import { Conversation } from '../models/Conversation.js';
import { getDbStatus } from '../config/db.js';

// Starts completely empty: students choose who they want to chat with from the directory
let fallbackConversations = [];

/**
 * Get all conversations for the current student
 */
export const getConversations = async (req, res, next) => {
  try {
    const { connected } = getDbStatus();

    if (connected) {
      const conversations = await Conversation.find({
        participants: req.userId,
      }).sort({ updatedAt: -1 });

      const formatted = conversations.map((c) => ({
        ...c.toObject(),
        id: c._id.toString(),
      }));

      return res.json(formatted);
    }

    return res.json(fallbackConversations);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single conversation by ID
 */
export const getConversationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { connected } = getDbStatus();

    if (connected) {
      const conv = await Conversation.findById(id);
      if (!conv) {
        return res.status(404).json({ success: false, message: 'Conversation not found' });
      }
      return res.json({ ...conv.toObject(), id: conv._id.toString() });
    }

    const found = fallbackConversations.find((c) => c.id === id || c._id === id);
    if (!found) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    return res.json(found);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new conversation (Direct or Group)
 */
export const createConversation = async (req, res, next) => {
  try {
    const { name, type = 'direct', title, avatar, department, participants = [] } = req.body;
    const { connected } = getDbStatus();

    const allParticipants = Array.from(new Set([req.userId, ...participants]));

    if (connected) {
      const newConv = await Conversation.create({
        name,
        type,
        title: title || (type === 'group' ? 'Study Group' : 'Student Chat'),
        avatar: avatar || '',
        department: department || '',
        participants: allParticipants,
        lastMessage: null,
      });

      return res.status(201).json({
        ...newConv.toObject(),
        id: newConv._id.toString(),
      });
    }

    // In-memory create
    const newConv = {
      _id: `conv-${Date.now()}`,
      id: `conv-${Date.now()}`,
      name,
      type,
      title: title || (type === 'group' ? 'Study Group' : 'Student Chat'),
      avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      department: department || '',
      status: 'online',
      participants: allParticipants,
      unreadCount: 0,
      pinned: false,
      lastMessage: null,
      messages: [],
    };

    fallbackConversations.unshift(newConv);
    return res.status(201).json(newConv);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete / Remove a conversation
 */
export const deleteConversation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { connected } = getDbStatus();

    if (connected) {
      await Conversation.findByIdAndDelete(id);
    }

    fallbackConversations = fallbackConversations.filter(
      (c) => c.id !== id && c._id !== id
    );

    return res.json({ success: true, id });
  } catch (error) {
    next(error);
  }
};
