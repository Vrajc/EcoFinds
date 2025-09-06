import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  startChat,
  getUserChats,
  getChatMessages,
  sendMessage
} from '../controllers/chatController.js';

const router = express.Router();

// Start a new chat or get existing chat
router.post('/start', auth, startChat);

// Get user's chats
router.get('/my-chats', auth, getUserChats);

// Get chat messages
router.get('/:chatId', auth, getChatMessages);

// Send message
router.post('/message', auth, sendMessage);

export default router;
