import {
  getCartService,
  addToCartService,
  updateCartItemService,
  removeFromCartService,
  clearCartService
} from "./cart.service.js";

import asyncHandler from "express-async-handler";
import { successResponse } from "../../utils/apiResponse.js";


const getCart = asyncHandler(async (req, res) => {
  const cart = await getCartService( req.user._id );
  return successResponse( 200, res, "Cart fetched successfully", cart );
});


const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await addToCartService( req.user._id, productId, quantity );
  return successResponse( 200, res, "Item added to cart successfully", cart );
});


const updateCartItem = asyncHandler(async (req, res) => {
  const cart = await updateCartItemService( req.user._id, req.params.productId, req.body.quantity );
  return successResponse( 200, res, "Cart item updated successfully", cart );
});


const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await removeFromCartService( req.user._id, req.params.productId );
  return successResponse( 200, res, "Item removed from cart successfully", cart );
});


const clearCart = asyncHandler(async (req, res) => {
  const cart = await clearCartService( req.user._id );
  return successResponse( 200, res, "Cart cleared successfully", cart );
});


export {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};