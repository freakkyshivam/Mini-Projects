import express from 'express'
import { allSessions, UserInfo,changePassword } from '../controllers/user.controller';
import authMiddleware from '../middleware/auth.middleware';
const router = express.Router();

router.get('/me',authMiddleware,UserInfo);
router.get('/sessions',authMiddleware,allSessions);
router.post('/change-password', authMiddleware, changePassword)
export default router;