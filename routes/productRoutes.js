import express from 'express';
import {
  getProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from '../src/product/product.controller.js';


import  protect from "../middleware/authMiddleware.js";
import restrictTo from '../middleware/restrictTo.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

/*
  PUBLIC ROUTES
*/

router.get('/', getProducts);
router.get('/:id', getSingleProduct);

/*
  ADMIN ROUTES
*/

router.post('/', protect, upload.array("images", 5), restrictTo('admin'), createProduct);
router.put('/:id', protect, restrictTo('admin'), updateProduct);
router.delete('/:id', protect, restrictTo('admin'), deleteProduct);


export default router;