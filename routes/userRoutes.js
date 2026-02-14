import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { updateMyProfile, changeMyPassword, forgotPasswordMOtp, addMyAddress, getAddresses, updateMyAddress, deleteMyAddress} from '../src/user/controller.js';

const router = express.Router();

router.put('/me', protect, updateMyProfile);
router.put('/change-password', protect, changeMyPassword);
router.put('/forgot-password-prev', protect, forgotPasswordMOtp);

router.post('/address', protect, addMyAddress);
router.get('/address', protect, getAddresses);
router.put('/address/:id', protect, updateMyAddress);
router.delete('/address/:id', protect, deleteMyAddress);




export default router;
