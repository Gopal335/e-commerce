import {
  createOrderService,
  getMyOrdersService,
  getOrderByIdService,
  getAllOrdersService,
  updateOrderStatusService
} from './order.service.js';

import { BadRequestError } from '../../utils/appError.js';
import asyncHandler from '../../middleware/asyncHandler.js';


/* ======================================
   CREATE ORDER
====================================== */
const createOrder = asyncHandler(async (req, res) => {

  const { addressId, address } = req.body;

  const order = await createOrderService(
    req.user._id,
    { addressId, address }
  );

  res.status(201).json({
    success: true,
    data: order
  });

});

/* ======================================
   GET MY ORDERS
====================================== */
const getMyOrders = asyncHandler(async (req, res) => {

  const orders = await getMyOrdersService(req.user._id);

  res.status(200).json({
    success: true,
    data: orders
  });

});


/* ======================================
   GET ORDER BY ID
====================================== */
const getOrderById = asyncHandler(async (req, res) => {

  const order = await getOrderByIdService(
    req.user._id,
    req.params.id
  );

  res.status(200).json({
    success: true,
    data: order
  });

});


/* ======================================
   GET ALL ORDERS
====================================== */
const getAllOrders = asyncHandler(async (req, res) => {

  const orders = await getAllOrdersService();

  res.status(200).json({
    success: true,
    data: orders
  });

});


/* ======================================
   UPDATE ORDER STATUS
====================================== */
const updateOrderStatus = asyncHandler(async (req, res) => {

  const order = await updateOrderStatusService(
    req.params.id,
    req.body.status
  );

  res.status(200).json({
    success: true,
    data: order
  });

});


export {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
};
