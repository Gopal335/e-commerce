import asyncHandler from '../middleware/validate/asyncHandler.js';

import {
  getAllProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService
} from './service.js';


/* ======================================
   GET ALL PRODUCTS
====================================== */

export const getProducts = asyncHandler(async (req, res) => {
  const result = await getAllProductsService(req.query);

  res.status(200).json({
    success: true,
    ...result
  });
});


/* ======================================
   GET SINGLE PRODUCT
====================================== */

export const getSingleProduct = asyncHandler(async (req, res) => {
  const product = await getProductByIdService(req.params.id);

  res.status(200).json({
    success: true,
    product
  });
});


/* ======================================
   CREATE PRODUCT (Admin)
====================================== */

export const createProduct = asyncHandler(async (req, res) => {
  const product = await createProductService(req.user._id, req.body);

  res.status(201).json({
    success: true,
    product
  });
});


/* ======================================
   UPDATE PRODUCT (Admin)
====================================== */

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await updateProductService(req.params.id, req.body);

  res.status(200).json({
    success: true,
    product
  });
});


/* ======================================
   DELETE PRODUCT (Admin)
====================================== */

export const deleteProduct = asyncHandler(async (req, res) => {
  await deleteProductService(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  });
});