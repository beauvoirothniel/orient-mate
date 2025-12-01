import express from 'express';
import { sendMessage } from '../controllers/chatController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/messages', authenticateToken, sendMessage);

export default router;
