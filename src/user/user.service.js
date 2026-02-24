import User from '../../models/User.js';
import generateCsv from '../../utils/generateCsv.js';
import generatePdf from '../../utils/generatePdf.js';
import mailSender from '../../utils/mailSender.js';
import Product from '../../models/Product.js';

import {
  NotFoundError,
  BadRequestError,
  ForbiddenError
} from '../../utils/appError.js';


/* ======================================
   FETCH ALL USERS
====================================== */

const fetchAllUsers = async () => {

  const users = await User.find({
    role: { $ne: 'admin' }
  }).select('-password');

  return users;
};


/* ======================================
   FETCH SINGLE USER
====================================== */

const fetchUser = async (id) => {

  const user = await User
    .findById(id)
    .select('-password');

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
};


/* ======================================
   UPDATE USER
====================================== */

const updateUser = async (id, data) => {

  delete data.role;
  delete data.password;

  const user = await User.findByIdAndUpdate(
    id,
    data,
    { new: true }
  ).select('-password');

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
};


/* ======================================
   DELETE USER
====================================== */

const deleteUser = async (id) => {

  const user = await User.findById(id);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (user.role === 'admin') {
    throw new ForbiddenError("Cannot delete admin");
  }

  await user.deleteOne();

  return { message: "User deleted successfully" };
};


/* ======================================
   CREATE USER BY ADMIN
====================================== */

const createUserByAdmin = async (data) => {

  const { name, email, phone, password } = data;

  if (!name || !email || !password) {
    throw new BadRequestError("Required fields missing");
  }

  const exists = await User.findOne({ email });

  if (exists) {
    throw new BadRequestError("User already exists");
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
    role: 'user'
  });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role
  };
};






/* ======================================
   SEND USERS REPORT
====================================== */

const sendUsersReportService = async (adminId) => {

  const admin = await User.findById(adminId);

  if (!admin || admin.role !== "admin") {
    throw new ForbiddenError("Unauthorized");
  }

  const users = await User.find({
    role: { $ne: "admin" }
  }).select("-password");

  if (!users.length) {
    throw new NotFoundError("No users found");
  }

  const csvBuffer = generateCsv(users);
  const pdfBuffer = await generatePdf(users);

  await mailSender(admin.email, csvBuffer, pdfBuffer);

  return { message: "Users report sent to admin email" };
};




export {
  fetchAllUsers,
  fetchUser,
  updateUser,
  deleteUser,
  createUserByAdmin,
  sendUsersReportService
};
