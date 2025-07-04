import express from 'express';
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
} from '../controllers/message.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();
router.get('/users', protectRoute, getUsersForSidebar);
router.get('/chat/:id', protectRoute, getMessages); // Fixed line
router.post('/send/:id', protectRoute, sendMessage);
export default router;
