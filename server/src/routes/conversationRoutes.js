import express from 'express';
import {
  getConversations,
  getConversationById,
  createConversation,
  deleteConversation,
} from '../controllers/conversationController.js';
import {
  getMessages,
  sendMessage,
} from '../controllers/messageController.js';

const router = express.Router();

// Conversation endpoints
router.get('/', getConversations);
router.post('/', createConversation);
router.get('/:id', getConversationById);
router.delete('/:id', deleteConversation);

// Message sub-resource endpoints
router.get('/:id/messages', getMessages);
router.post('/:id/messages', sendMessage);

export default router;
