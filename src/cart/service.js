import Cart from '../../models/cart.model.js';
import Product from '../../models/Product.js';
import AppError from '../utils/appError.js';

/* ======================================
   GET CART
====================================== */

export const getCartService = async (userId) => {
  let cart = await Cart.findOne({ user: userId })
    .populate('items.product', 'name price images');

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  return cart;
};


/* ======================================
   ADD ITEM TO CART
====================================== */

export const addToCartService = async (userId, productId, quantity) => {

  const product = await Product.findById(productId);

  if (!product || !product.isActive) {
    throw new AppError('Product not found', 404);
  }

  if (product.stock < quantity) {
    throw new AppError('Insufficient stock', 400);
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
   UPDATE CART ITEM QUANTITY
====================================== */

export const updateCartItemService = async (userId, productId, quantity) => {

  const cart = await Cart.findOne({ user: userId });

  if (!cart) throw new AppError('Cart not found', 404);

  const item = cart.items.find(
    item => item.product.toString() === productId
  );

  if (!item) throw new AppError('Item not in cart', 404);

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
   REMOVE ITEM FROM CART
====================================== */

export const removeFromCartService = async (userId, productId) => {

  const cart = await Cart.findOne({ user: userId });

  if (!cart) throw new AppError('Cart not found', 404);

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

  if (!cart) throw new AppError('Cart not found', 404);

  cart.items = [];
  cart.totalItems = 0;
  cart.totalPrice = 0;

  await cart.save();

  return cart;
};


/* ======================================
   HELPER: RECALCULATE TOTALS
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
