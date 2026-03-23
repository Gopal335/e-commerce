import * as adminService from "./user.service.js";
import asyncHandler from "express-async-handler";
import { successResponse } from "../../utils/apiResponse.js";


const getAllUsers = asyncHandler(async (req, res) => {
  const users = await adminService.fetchAllUsers();
  return successResponse( 200, res,  "Users fetched successfully",
    {
      count: users.length,
      users
    }
  );
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await adminService.fetchUser(req.params.id);
  return successResponse( 200,  res,  "User fetched successfully",  user );
});


const updateUser = asyncHandler(async (req, res) => {
  const updated = await adminService.updateUser( req.params.id,  req.body );
  return successResponse(  200,  res, "User updated successfully",  updated );
});

const deleteUser = asyncHandler(async (req, res) => {
  await adminService.deleteUser(req.params.id);
  return successResponse(  200,  res, "User deleted successfully",  null );
});


const createUser = asyncHandler(async (req, res) => {
  const user = await adminService.createUserByAdmin( req.body );
  return successResponse( 201, res,  "User created successfully",  user );
});

const deleteProduct = asyncHandler(async (req, res) => {
  const result = await adminService.deleteProduct( req.params.id );
  return successResponse( 200, res, "Product deleted successfully",  result );
});


const sendUsersReportController = asyncHandler(async (req, res) => {
  const result = await adminService.sendUsersReportService( req.user._id );
  return successResponse( 200,  res, "Users report sent successfully", result );
});

export {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
  deleteProduct,
  sendUsersReportController
};