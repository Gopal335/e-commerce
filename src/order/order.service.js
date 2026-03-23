import Order from "../../models/order.js";
import Cart from "../../models/cart.model.js";
import Product from "../../models/Product.js";
import Address from "../../models/address.model.js";
import Image from "../../models/image.js";
import mongoose from "mongoose";

import {
  BadRequestError,
  NotFoundError,
  ForbiddenError
} from "../../utils/appError.js";

 const createOrderService = async (userId, orderData) => {
  const { addressId, address, payment } = orderData;
  if (!payment || !payment.method) {
    throw new BadRequestError("Payment method is required");
  }
  const cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart || cart.items.length === 0) {
    throw new BadRequestError("Cart is empty");
  }
  let finalAddress;
  if (addressId) {
    finalAddress = await Address.findOne({ _id: addressId, user: userId });
    if (!finalAddress) {
      throw new NotFoundError("Address not found");
    }
  } else if (address) {
    finalAddress = await Address.create({
      ...address,
      user: userId,
      isDefault: false
    });
  } else {
    finalAddress = await Address.findOne({ user: userId, isDefault: true });
    if (!finalAddress) {
      throw new BadRequestError("No address provided and no default address found");
    }
  }
  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      throw new BadRequestError(`Insufficient stock for ${item.product.name}`);
    }
  }
  const order = await Order.create({
    user: userId,
    address: finalAddress._id,
    items: cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      price: item.price,
      quantity: item.quantity,
      image: item.product.images?.[0]
    })),
    totalItems: cart.totalItems,
    totalPrice: cart.totalPrice,
    payment: {
      method: payment.method,
      status: payment.method === "COD" ? "Pending" : "Paid",
      paidAt: payment.method === "COD" ? null : new Date()
    }
  });
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
  }
  cart.items = [];
  cart.totalItems = 0;
  cart.totalPrice = 0;
  await cart.save();
  return order;
};

 const getMyOrdersService = async (userId) => {
  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).lean();
  for (const order of orders) {
    for (const item of order.items) {
      if (item.image && mongoose.Types.ObjectId.isValid(item.image)) {
        const imageDoc = await Image.findById(item.image).lean();
        item.image = imageDoc?.url || null;
      }
    }
  }
  return orders.map(order => ({
    ...order,
    items: order.items.map(item => ({
      productId: item.product,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image
    }))
  }));
};

 const getOrderByIdService = async (userId, orderId) => {
  const order = await Order.findById(orderId).populate("user", "name email");
  if (!order) {
    throw new NotFoundError("Order not found");
  }
  if (order.user._id.toString() !== userId.toString()) {
    throw new ForbiddenError("Not authorized to access this order");
  }
  return order;
};

 const getAllOrdersService = async () => {
  return await Order.find().populate("user", "name email").sort({ createdAt: -1 });
};

 const updateOrderStatusService = async (orderId, status) => {
  const allowedStatuses = [
    "Pending",
    "Paid",
    "Shipped",
    "Delivered",
    "Cancelled",
    "Refunded"
  ];
  if (!allowedStatuses.includes(status)) {
    throw new BadRequestError("Invalid status value");
  }
  const order = await Order.findById(orderId);
  if (!order) {
    throw new NotFoundError("Order not found");
  }
  order.status = status;
  if (status === "Paid") {
    order.isPaid = true;
    order.paidAt = new Date();
  }
  await order.save();
  return order;
};

export{
  createOrderService,
  getMyOrdersService,
  getOrderByIdService,
  getAllOrdersService,
  updateOrderStatusService
};