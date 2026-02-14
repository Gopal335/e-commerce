import express from 'express';
import {
  getProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from '../src/product/controller.js';


import  protect from "../middleware/authMiddleware.js";
import restrictTo from '../middleware/restrictTo.js';

const router = express.Router();

/*
  PUBLIC ROUTES
*/

router.get('/', getProducts);
router.get('/:id', getSingleProduct);

/*
  ADMIN ROUTES
*/

router.post('/', protect, restrictTo('admin'), createProduct);
router.put('/:id', protect, restrictTo('admin'), updateProduct);
router.delete('/:id', protect, restrictTo('admin'), deleteProduct);

export default router;