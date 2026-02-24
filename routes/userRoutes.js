import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';



import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser, 
  sendUsersReportController
} from '../src/user/user.controller.js';

const router = express.Router();

// Protect ALL routes
router.use(authMiddleware, adminMiddleware);

router.get('/', getAllUsers);

router.get('/:id', getUserById);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);

router.post('/', createUser);

router.get("/send-users-report", sendUsersReportController);



export default router;
