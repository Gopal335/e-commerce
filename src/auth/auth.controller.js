import * as authService from "./auth.service.js";
import asyncHandler from "express-async-handler";
import { successResponse } from "../../utils/apiResponse.js";

import {
  getLoggedInUser,
  updateLoggedInUser,
  changePassword
} from "./auth.service.js";

const signup = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  const result = await authService.registerUser( name, email, password, phone );
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return successResponse( 201, res, "User registered successfully", { accessToken: result.accessToken } );
});

const signin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser( email, password );
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return successResponse( 200, res, "Login successful", { accessToken: result.accessToken } );
});

const sendVerificationOtpController = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const response = await authService.sendEmailVerificationOtp( email );
  return successResponse( 200, res, "OTP sent successfully", response );
});

const verifyEmailController = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const response = await authService.verifyEmail( email, otp );
  return successResponse( 200, res, "Email verified successfully", response );
});

const forgotPasswordController = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const response = await authService.forgotPassword( email );
  return successResponse( 200, res, "Password reset OTP sent", response );
});

const resetPasswordController = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const result = await authService.resetPassword( email, otp, newPassword );
  return successResponse( 200, res, "Password reset successfully", result );
});

const logoutController = asyncHandler(async (req, res) => {
  const result = await authService.logoutUser( req.user._id );
  return successResponse( 200, res, "Logout successful", result );
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await getLoggedInUser( req.user.id );
  return successResponse( 200, res, "Profile fetched successfully", user );
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await updateLoggedInUser( req.user.id, req.body );
  return successResponse( 200, res, "Profile updated successfully", user );
});

const updatePassword = asyncHandler(async (req, res) => {
  await changePassword( req.user.id, req.body.oldPassword, req.body.newPassword );
  return successResponse( 200, res, "Password updated successfully", null );
});

export {
  signup,
  signin,
  logoutController,
  resetPasswordController,
  forgotPasswordController,
  getProfile,
  updateProfile,
  updatePassword,
};