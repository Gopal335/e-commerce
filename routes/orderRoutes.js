import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} from '../src/order/order.controller.js';


import protect from '../middleware/authMiddleware.js';
import restrictTo from '../middleware/restrictTo.js';

const router= express.Router();


router.post('/', protect, createOrder);
router.get('/me', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

router.get('/', protect, restrictTo('admin'), getAllOrders);
router.put('/:id/status', protect, restrictTo('admin'), updateOrderStatus);


export default router;