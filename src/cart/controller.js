import asyncHandler from '../middleware/validate/asyncHandler.js';
import {
  getCartService,
  addToCartService,
  updateCartItemService,
  removeFromCartService,
  clearCartService
} from './service.js';

/* ======================================
   GET CART
====================================== */

export const getCart = asyncHandler(async (req, res) => {
  const cart = await getCartService(req.user._id);

  res.status(200).json({
    success: true,
    cart
  });
});


/* ======================================
   ADD ITEM
====================================== */

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  const cart = await addToCartService(
    req.user._id,
    productId,
    quantity
  );

  res.status(200).json({
    success: true,
    cart
  });
});


/* ======================================
   UPDATE ITEM
====================================== */

export const updateCartItem = asyncHandler(async (req, res) => {
  const cart = await updateCartItemService(
    req.user._id,
    req.params.productId,
    req.body.quantity
  );

  res.status(200).json({
    success: true,
    cart
  });
});


/* ======================================
   REMOVE ITEM
====================================== */

export const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await removeFromCartService(
    req.user._id,
    req.params.productId
  );

  res.status(200).json({
    success: true,
    cart
  });
});


/* ======================================
   CLEAR CART
====================================== */

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await clearCartService(req.user._id);

  res.status(200).json({
    success: true,
    cart
  });
});
