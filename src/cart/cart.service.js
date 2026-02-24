import Cart from '../../models/cart.model.js';
import Product from '../../models/Product.js';
import {
  NotFoundError,
  BadRequestError
} from '../../utils/appError.js';
import mongoose from 'mongoose';

/* ======================================
   GET CART
====================================== */

// import Cart from '../../models/cart.model.js';
import Image from '../../models/image.js';

export const getCartService = async (userId) => {

  let cart = await Cart.findOne({ user: userId })
    .populate({
      path: "items.product",
      populate: {
        path: "images",
        model: "Image",
        select: "url"
      }
    })
    .lean();

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
    return cart;
  }

  /* ===============================
     FORMAT RESPONSE
  =============================== */

  cart.items = cart.items.map(item => ({
    quantity: item.quantity,
    price: item.price,
    product: {
      _id: item.product._id,
      name: item.product.name,
      price: item.product.price,
      brand: item.product.brand,
      category: item.product.category,
      discountPrice: item.product.discountPrice,

      // Replace image objects with URL only
      images: item.product.images.map(img => img.url)
    }
  }));

  cart.totalItems = cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  cart.totalPrice = cart.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  return cart;
};
/* ======================================
   ADD TO CART
====================================== */

export const addToCartService = async (userId, productId, quantity) => {

  if (!quantity || quantity <= 0) {
    throw new BadRequestError("Quantity must be greater than 0");
  }

  const product = await Product.findById(productId);

  if (!product ) {
    throw new NotFoundError("Product not found");
  }

  if (product.stock < quantity) {
    throw new BadRequestError("Insufficient stock");
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  const existingItem = cart.items.find(
    item => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
      price: product.price
    });
  }

  recalculateCart(cart);
  await cart.save();

  return cart;
};

/* ======================================
   UPDATE CART ITEM
====================================== */

export const updateCartItemService = async (userId, productId, quantity) => {

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new NotFoundError("Cart not found");
  }

  const item = cart.items.find(
    item => item.product.toString() === productId
  );

  if (!item) {
    throw new NotFoundError("Item not in cart");
  }

  if (quantity <= 0) {
    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );
  } else {
    item.quantity = quantity;
  }

  recalculateCart(cart);
  await cart.save();

  return cart;
};

/* ======================================
   REMOVE ITEM
====================================== */

export const removeFromCartService = async (userId, productId) => {

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new NotFoundError("Cart not found");
  }

  cart.items = cart.items.filter(
    item => item.product.toString() !== productId
  );

  recalculateCart(cart);
  await cart.save();

  return cart;
};

/* ======================================
   CLEAR CART
====================================== */

export const clearCartService = async (userId) => {

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new NotFoundError("Cart not found");
  }

  cart.items = [];
  cart.totalItems = 0;
  cart.totalPrice = 0;

  await cart.save();

  return cart;
};

/* ======================================
   HELPER
====================================== */

const recalculateCart = (cart) => {
  cart.totalItems = cart.items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  cart.totalPrice = cart.items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
};
