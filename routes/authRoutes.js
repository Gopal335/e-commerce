import express from 'express';
import { signup, signin, sendVerificationOtpController, verifyEmailController, forgotPasswordController, resetPasswordController, logoutController,
    getProfile, updateProfile, updatePassword, forgotPassword
 } from '../src/auth/auth.controller.js';
import validateSignup from '../middleware/validateAuth.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', validateSignup, signup);
router.post('/signin', signin);

// router.post("/send-verification-otp", sendVerificationOtpController);
// router.post("/verify-email", verifyEmailController);
router.post('/forgot-password',protect, forgotPasswordController);
router.put('/reset-password',protect, resetPasswordController);
router.post('/logout', protect, logoutController);


router.get("/me", protect, getProfile);
router.put('/me', protect, updateProfile);
router.put('/change-password', protect, updatePassword);
router.put('/change-password-master', protect, forgotPassword);

export default router;
