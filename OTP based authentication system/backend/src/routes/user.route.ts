import {Router} from 'express'
import { allSessions, UserInfo,changePassword } from '../controllers/user.controller';
import authMiddleware from '../middleware/auth.middleware';
import type { Router as RouterType } from 'express';

const router: RouterType = Router();

router.get('/me',authMiddleware,UserInfo);
router.get('/sessions',authMiddleware,allSessions);
router.post('/change-password', authMiddleware, changePassword)
export default router;