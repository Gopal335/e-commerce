import express from 'express';
import { signup, signin, sendVerificationOtpController, verifyEmailController, forgotPasswordController, resetPasswordController, logoutController } from '../src/auth/controller.js';
import validateSignup from '../middleware/validateAuth.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post("/send-verification-otp", sendVerificationOtpController);
router.post("/verify-email", verifyEmailController);
router.post('/forgot-password',protect, forgotPasswordController);
router.put('/reset-password',protect, resetPasswordController);
router.post('/logout', protect, logoutController)

export default router;
