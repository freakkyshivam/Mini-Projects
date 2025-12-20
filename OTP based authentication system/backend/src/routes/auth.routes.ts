import { Router } from "express";
import { 
    login,
     register,
      verifyOtp,
      sendResetOtp,
       resetPassword,
       changePassword
     } from "../controllers/auth.controller.js";

     import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/send-reset-otp',sendResetOtp);
router.post('/reset-password', resetPassword)
router.post('/change-password', authMiddleware, changePassword )

export default router;
