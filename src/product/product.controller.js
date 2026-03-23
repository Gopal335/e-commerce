import {
  getAllProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService
} from "./product.service.js";

import asyncHandler from "express-async-handler";
import { successResponse } from "../../utils/apiResponse.js";


const getProducts = asyncHandler(async (req, res) => {
  const result = await getAllProductsService( req.query );
  return successResponse( 200, res, "Products fetched successfully", result );
});

const getSingleProduct = asyncHandler(async (req, res) => {
  const product = await getProductByIdService( req.params.id );
  return successResponse( 200, res, "Product fetched successfully", product );
});

const createProduct = asyncHandler(async (req, res) => {
  const product = await createProductService( req.user._id, req.body, req.files );
  return successResponse( 201, res, "Product created successfully", product );
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await updateProductService( req.params.id, req.body );
  return successResponse( 200, res, "Product updated successfully", product );
});

const deleteProduct = asyncHandler(async (req, res) => {
  await deleteProductService( req.params.id );
  return successResponse( 200, res, "Product deleted successfully", null );
});


export {
  getProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct
};