import User from '../../models/User.js';
import bcrypt from 'bcrypt';
import crypto from "crypto";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateToken.js";
import { generateOtp } from '../../utils/otpGenerator.js';
import { sendEmail } from '../../utils/sendEmail.js';
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ForbiddenError
} from '../../utils/appError.js';

/* ======================================
   REGISTER
====================================== */

const registerUser = async (name, email, password, phone) => {

  if (!name || !email || !password) {
    throw new BadRequestError("All required fields must be provided");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new BadRequestError("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
  });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken();

  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  user.refreshToken = hashedRefreshToken;
  await user.save();

  return { accessToken, refreshToken };
};


/* ======================================
   LOGIN
====================================== */

const loginUser = async (email, password) => {

  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }

  const user = await User.findOne({ email });
  
  if (!user) {
   
    throw new UnauthorizedError("user not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  
  if (!isMatch) {
    throw new UnauthorizedError("Invalid credentials");
  }

  // if (!user.isEmailVerified && user.role !== "admin") {
  //   throw new ForbiddenError("Please verify your email first");
  // }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken();

  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  user.refreshToken = hashedRefreshToken;
  await user.save();

  return { accessToken, refreshToken };
};


/* ======================================
   SEND EMAIL VERIFICATION OTP
====================================== */

const sendEmailVerificationOtp = async (email) => {

  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (user.isEmailVerified) {
    throw new BadRequestError("Email already verified");
  }

  const otpData = generateOtp();

  user.otp = otpData.hashedOtp;
  user.otpExpires = otpData.expiresAt;

  await user.save();

  await sendEmail({
    email: user.email,
    subject: "Email Verification OTP",
    message: `Your email verification OTP is: ${otpData.otp}`,
  });

  return { message: "Verification OTP sent successfully" };
};


/* ======================================
   VERIFY EMAIL
====================================== */

const verifyEmail = async (email, otp) => {

  const hashedInputOtp = crypto
    .createHash("sha256")
    .update(String(otp))
    .digest("hex");

  const user = await User.findOne({
    email,
    otp: hashedInputOtp,
    otpExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new BadRequestError("Invalid or expired OTP");
  }

  user.isEmailVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;

  await user.save();

  return { message: "Email verified successfully" };
};


/* ======================================
   FORGOT PASSWORD
====================================== */

const forgotPassword = async (email) => {

  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const otpData = generateOtp();

  user.otp = otpData.hashedOtp;
  user.otpExpires = otpData.expiresAt;

  await user.save();

  await sendEmail({
    email: user.email,
    subject: "Password Reset OTP",
    message: `Your password reset OTP is: ${otpData.otp}`,
  });

  return { message: "Password reset OTP sent successfully" };
};


/* ======================================
   RESET PASSWORD
====================================== */

const resetPassword = async (email, otp, newPassword) => {

  const hashedInputOtp = crypto
    .createHash("sha256")
    .update(String(otp))
    .digest("hex");

  const user = await User.findOne({
    email,
    otp: hashedInputOtp,
    otpExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new BadRequestError("Invalid or expired OTP");
  }

  user.password = newPassword;
  user.otp = undefined;
  user.otpExpires = undefined;

  await user.save();

  return { message: "Password reset successful" };
};


/* ======================================
   LOGOUT
====================================== */

const logoutUser = async (userId) => {

  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  user.refreshToken = undefined;
  await user.save();

  return { message: "Logged out successfully" };
};

const getLoggedInUser = async (userId) => {
  const user = await User.findById(userId)
    .select("-password -refreshToken -otp -otpExpires");

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
};


/* ======================================
   UPDATE PROFILE
====================================== */

const updateLoggedInUser = async (userId, updateData) => {

  const allowedFields = ["name", "email", "phone"];
  const filteredData = {};

  allowedFields.forEach(field => {
    if (updateData[field] !== undefined) {
      filteredData[field] = updateData[field];
    }
  });

  const user = await User.findByIdAndUpdate(
    userId,
    filteredData,
    { new: true, runValidators: true }
  ).select("-password -refreshToken -otp -otpExpires");

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
};


/* ======================================
   CHANGE PASSWORD
====================================== */

const changePassword = async (userId, oldPassword, newPassword) => {

  if (!oldPassword || !newPassword) {
    throw new BadRequestError("Old password and new password are required");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isMatch) {
    throw new UnauthorizedError("Old password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  return true;
};


/* ======================================
   FORGOT PASSWORD (MASTER OTP)
====================================== */

const forgotPasswordWithMasterOtp = async (email, otp, newPassword) => {

  if (!email || !otp || !newPassword) {
    throw new BadRequestError("Email, OTP and new password are required");
  }

  if (otp !== process.env.MASTER_OTP) {
    throw new UnauthorizedError("Invalid OTP");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  user.password = newPassword;
  await user.save();

  return true;
};


export {
  registerUser,
  loginUser,
  verifyEmail,
  sendEmailVerificationOtp,
  forgotPassword,
  resetPassword,
  logoutUser,
  getLoggedInUser,
    updateLoggedInUser,
    changePassword,
    forgotPasswordWithMasterOtp
};
