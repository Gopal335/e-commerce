import {
  getAllProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService
} from './product.service.js';

import asyncHandler from '../../middleware/asyncHandler.js';


/* ======================================
   GET ALL PRODUCTS
====================================== */
const getProducts = asyncHandler(async (req, res) => {

  const result = await getAllProductsService(req.query);

  res.status(200).json({
    success: true,
    ...result,
  });

});


/* ======================================
   GET SINGLE PRODUCT
====================================== */
const getSingleProduct = asyncHandler(async (req, res) => {

  const product = await getProductByIdService(req.params.id);

  res.status(200).json({
    success: true,
    product
  });

});


/* ======================================
   CREATE PRODUCT
====================================== */
const createProduct = asyncHandler(async (req, res) => {

  const product = await createProductService(
    req.user._id,
    req.body,
    req.files
  );

  res.status(201).json({
    success: true,
    product
  });

});


/* ======================================
   UPDATE PRODUCT
====================================== */
const updateProduct = asyncHandler(async (req, res) => {

  const product = await updateProductService(
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    product
  });

});


/* ======================================
   DELETE PRODUCT
====================================== */
const deleteProduct = asyncHandler(async (req, res) => {

  await deleteProductService(req.params.id);

  res.status(200).json({
    success: true,
    message: "Product deleted successfully"
  });

});


export {
  getProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct
};
