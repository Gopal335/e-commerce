import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import { sendUsersReportController } from '../src/admin/controller.js';


import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
  // createProduct,
  // updateProduct,
  // deleteProduct
} from '../src/admin/controller.js';

const router = express.Router();

// Protect ALL routes
router.use(authMiddleware, adminMiddleware);

router.get('/users', getAllUsers);

router.get('/users/:id', getUserById);

router.put('/users/:id', updateUser);

router.delete('/users/:id', deleteUser);

router.post('/users', createUser);

router.get(
  "/send-users-report",
  authMiddleware,
  adminMiddleware,
  sendUsersReportController
);

// router.post('/products', createProduct);

// router.put('/products/:id', updateProduct);

// router.delete('/products/:id', deleteProduct);

export default router;
