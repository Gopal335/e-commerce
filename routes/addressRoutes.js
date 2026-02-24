import express from 'express';
import {
  addAddress,
  getMyAddresses,
  updateAddress,
  deleteAddress
} from '../src/address/address.controller.js';
import  protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getMyAddresses);
router.post('/', addAddress);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);

export default router;
  