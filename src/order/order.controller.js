import {
  createOrderService,
  getMyOrdersService,
  getOrderByIdService,
  getAllOrdersService,
  updateOrderStatusService
} from "./order.service.js";

import asyncHandler from "express-async-handler";
import { successResponse } from "../../utils/apiResponse.js";


const createOrder = asyncHandler(async (req, res) => {
  const { addressId, address, payment } = req.body;
  const order = await createOrderService( req.user._id, { addressId, address, payment } );
  return successResponse( 201, res, "Order created successfully", order );
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await getMyOrdersService( req.user._id );
  return successResponse( 200, res, "Orders fetched successfully", orders );
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await getOrderByIdService( req.user._id, req.params.id );
  return successResponse( 200, res, "Order fetched successfully", order );
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await getAllOrdersService();
  return successResponse( 200, res, "All orders fetched successfully", orders );
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await updateOrderStatusService( req.params.id, req.body.status );
  return successResponse( 200, res, "Order status updated successfully", order );
});

export {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
};