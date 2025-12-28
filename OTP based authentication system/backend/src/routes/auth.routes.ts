import { Router } from "express";
import { 
    login,
     register,
     verifyRegisterOtp,
     sendResetOtp,
       resetPassword,
       
       logout,
       terminateAllOtherDevice,
       refreshToken,
       revokeSession
     } from "../controllers/auth.controller.js";

     import authMiddleware from "../middleware/auth.middleware.js";
     import { deviceInfo } from "../middleware/deviceInfo.js";

import type { Router as RouterType } from 'express';

const router:RouterType = Router();

router.post('/register', register);
router.post('/verify-register-otp', deviceInfo,verifyRegisterOtp)
router.post('/login',deviceInfo, login);
 router.post('/send-reset-otp',sendResetOtp)
router.post('/reset-password', resetPassword)

router.post('/logout',authMiddleware,logout);
router.post('/terminate-all-other-device',authMiddleware,terminateAllOtherDevice)
router.post('/refresh-token',authMiddleware, refreshToken)
router.post('/revoke-session',authMiddleware, revokeSession)

export default router;
