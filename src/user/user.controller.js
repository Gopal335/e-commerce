import * as adminService from './user.service.js';
import asyncHandler from '../../middleware/asyncHandler.js';


/* ======================================
   GET ALL USERS
====================================== */
const getAllUsers = asyncHandler(async (req, res) => {

  const users = await adminService.fetchAllUsers();

  res.json({
    success: true,
    count: users.length,
    data: users
  });

});


/* ======================================
   GET USER BY ID
====================================== */
const getUserById = asyncHandler(async (req, res) => {

  const user = await adminService.fetchUser(
    req.params.id
  );

  res.json({
    success: true,
    data: user
  });

});


/* ======================================
   UPDATE USER
====================================== */
const updateUser = asyncHandler(async (req, res) => {

  const updated = await adminService.updateUser(
    req.params.id,
    req.body
  );

  res.json({
    success: true,
    data: updated
  });

});


/* ======================================
   DELETE USER
====================================== */
const deleteUser = asyncHandler(async (req, res) => {

  const result = await adminService.deleteUser(
    req.params.id
  );

  res.json({
    success: true,
    ...result
  });

});


/* ======================================
   CREATE USER
====================================== */
const createUser = asyncHandler(async (req, res) => {

  const user = await adminService.createUserByAdmin(
    req.body
  );

  res.status(201).json({
    success: true,
    data: user
  });

});


const deleteProduct = asyncHandler(async (req, res) => {

  const result = await adminService.deleteProduct(
    req.params.id
  );

  res.json({
    success: true,
    ...result
  });

});


/* ======================================
   SEND USERS REPORT
====================================== */
const sendUsersReportController = asyncHandler(async (req, res) => {

  const result =
    await adminService.sendUsersReportService(
      req.user._id
    );

  res.status(200).json({
    success: true,
    ...result
  });

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
