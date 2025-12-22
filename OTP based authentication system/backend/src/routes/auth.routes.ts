import { Router } from "express";
import { 
    login,
     register,
     verifyRegisterOtp,
     sendResetOtp,
       resetPassword,
       changePassword,
       logout,
       terminateAllDevice
     } from "../controllers/auth.controller.js";

     import authMiddleware from "../middleware/auth.middleware.js";
     import { deviceInfo } from "../middleware/deviceInfo.js";

const router = Router();

router.post('/register', register);
router.post('/verify-register-otp', deviceInfo,verifyRegisterOtp)
router.post('/login',deviceInfo, login);
 router.post('/send-reset-otp',sendResetOtp)
router.post('/reset-password', resetPassword)
router.post('/change-password', authMiddleware, changePassword)
router.post('/logout',authMiddleware,logout);
router.post('/terminate-all-device',authMiddleware,terminateAllDevice)

export default router;
